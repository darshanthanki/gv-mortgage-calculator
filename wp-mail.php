<?php
function wp_mail( $to, $subject, $message, $headers = '', $attachments = array() ) {

	// Compact the input, apply the filters, and extract them back out.
	$atts = apply_filters( 'wp_mail', compact( 'to', 'subject', 'message', 'headers', 'attachments' ) );
	extract( $atts );

	// Support using pre_wp_mail filter to short-circuit email sending.
	$pre_wp_mail = apply_filters( 'pre_wp_mail', null, $atts );

	if ( null !== $pre_wp_mail ) {
		return $pre_wp_mail;
	}

	$settings = array(
		'api_key'        => '52185163-b67b-4fb0-8b15-2fbb88276990',
		'stream_name'    => "outbound",
		'sender_address' => "support@agentamplification.com",
		'force_from'     => "Support",
		'force_html'     => 1,
	);

	if ( ! is_array( $attachments ) ) {
		$attachments = explode( "\n", str_replace( "\r\n", "\n", $attachments ) );
	}

	if ( ! empty( $headers ) && ! is_array( $headers ) ) {
		$headers = explode( "\n", str_replace( "\r\n", "\n", $headers ) );
	}

	/*
	==================================================
		Parse headers
	==================================================
	*/

	$recognized_headers = array();

	$headers_list = array(
		'Content-Type'     => array(),
		'Cc'               => array(),
		'Bcc'              => array(),
		'Reply-To'         => array(),
		'From'             => array(),
		'X-PM-Track-Opens' => array(),
		'X-PM-TrackLinks'  => array(),
		'X-PM-Tag'         => array()
	);

	$headers_list_lowercase = array_change_key_case( $headers_list, CASE_LOWER );

	if ( ! empty( $headers ) ) {
		foreach ( $headers as $key => $header ) {
			$key = strtolower( $key );
			if ( array_key_exists( $key, $headers_list_lowercase ) ) {
				$header_key = $key;
				$header_val = $header;
				$segments   = explode( ':', $header );
				if ( 2 === count( $segments ) ) {
					if ( array_key_exists( strtolower( $segments[0] ), $headers_list_lowercase ) ) {
						list( $header_key, $header_val ) = $segments;
						$header_key                      = strtolower( $header_key );
					}
				}
			} else {
				$segments = explode( ':', $header );
				if ( 2 === count( $segments ) ) {
					if ( array_key_exists( strtolower( $segments[0] ), $headers_list_lowercase ) ) {
						list( $header_key, $header_val ) = $segments;
						$header_key                      = strtolower( $header_key );
					}
				}
			}

			// If the key was detected, assign it.
			if ( isset( $header_key ) && isset( $header_val ) ) {
				if ( false === stripos( $header_val, ',' ) ) {
					$headers_list_lowercase[ $header_key ][] = trim( $header_val );
				} else {
					$vals = explode( ',', $header_val );
					foreach ( $vals as $val ) {
						$headers_list_lowercase[ $header_key ][] = trim( $val );
					}
				}

				unset( $header_key );
				unset( $header_val );
			}
		}

		foreach ( $headers_list as $key => $value ) {
			$value = $headers_list_lowercase[ strtolower( $key ) ];
			if ( count( $value ) > 0 ) {
				$recognized_headers[ $key ] = implode( ', ', $value );
			}
		}
	}

	/*
	==================================================
		Content-Type hook
	==================================================
	*/

	$content_type = 'text/plain';
	if ( isset( $recognized_headers['Content-Type'] ) ) {
		if ( false !== strpos( $recognized_headers['Content-Type'], 'text/html' ) ) {
			$content_type = 'text/html';
		}
	}
	$content_type = apply_filters( 'wp_mail_content_type', $content_type );

	/*
	==================================================
		Generate POST payload
	==================================================
	*/

	// Allow overriding the From address when specified in the headers.
	$from = $settings['sender_address'];

    $force_from = isset( $settings['force_from'] ) && $settings['force_from'];
	if ( false === $force_from && isset( $recognized_headers['From'] ) ) {
		$from = $recognized_headers['From'];
	}

	// Support using wp_mail_from_name filter.
	$from_name = '';
	$from_name = apply_filters( 'wp_mail_from_name', $from_name );

	if ( ! empty ( $from_name ) ) {
		$from = build_from_header_with_name( $from, $from_name );
	}

	$body = array(
		'From'     => $from,
		'To'       => is_array( $to ) ? implode( ',', $to ) : $to,
		'Subject'  => $subject,
		'TextBody' => $message,
	);

	if ( ! empty( $recognized_headers['Cc'] ) ) {
		$body['Cc'] = $recognized_headers['Cc'];
	}

	if ( ! empty( $recognized_headers['Bcc'] ) ) {
		$body['Bcc'] = $recognized_headers['Bcc'];
	}

	if ( ! empty( $recognized_headers['Reply-To'] ) ) {
		$body['ReplyTo'] = $recognized_headers['Reply-To'];
	}

	if ( isset( $settings['track_opens'] ) ) {
		$track_opens = (int) $settings['track_opens'];
	}

	if ( isset( $settings['track_links'] ) ) {
		$track_links = (int) $settings['track_links'];
	} else {
		$track_links = 0;
	}

	if ( isset( $recognized_headers['X-PM-Track-Opens'] ) ) {
		if ( $recognized_headers['X-PM-Track-Opens'] ) {
			$track_opens = 1;
		} else {
			$track_opens = 0;
		}
	}

	if ( isset( $recognized_headers['X-PM-TrackLinks'] ) ) {
		if ( 'none' !== $recognized_headers['X-PM-TrackLinks'] ) {
			$body['TrackLinks'] = $recognized_headers['X-PM-TrackLinks'];
		} else {
			$body['TrackLinks'] = 'none';
		}
	}

	$body['Tag'] = null;

	if ( isset( $recognized_headers['X-PM-Tag'] ) ) {
		$body['Tag'] = $recognized_headers['X-PM-Tag'];
	}

	// Support using a filter to set a tag on a message
	if ( has_filter( 'postmark_tag' ) ) {
		$body['Tag'] = apply_filters( 'postmark_tag', $body['Tag'] );
	}

	if ( 1 === (int) $settings['force_html'] || 'text/html' === $content_type || 1 === $track_opens ) {
		$body['HtmlBody'] = $message;
		// The user really, truly wants this sent as HTML, don't send it as text, too.
		// For historical reasons, we can't "force html" and "track opens" set both html and text bodies,
		// which is incorrect, but in order not to break existing behavior, we only strip out the textbody when
		// the user has gone to the trouble of specifying content type of 'text/html' in their headers.
		if ( 'text/html' === $content_type ) {
			unset( $body['TextBody'] );
		}
	}

	if ( 1 === $track_opens ) {
		$body['TrackOpens'] = 'true';
	}

	if ( 1 === $track_links ) {
		$body['TrackLinks'] = 'HtmlAndText';
	}

	if ( isset( $settings['stream_name'] ) && 'outbound' !== $settings['stream_name'] ) {
		$body['MessageStream'] = $settings['stream_name'];
	} else {
		$body['MessageStream'] = 'outbound';
	}

	foreach ( $attachments as $attachment ) {
		if ( is_readable( $attachment ) ) {
			$body['Attachments'][] = array(
				'Name'        => basename( $attachment ),
				'Content'     => base64_encode( file_get_contents( $attachment ) ),
				'ContentType' => postmark_determine_mime_content_type( $attachment ),
			);
		}
	}

	/*
	==================================================
		Send email
	==================================================
	*/

	// Handle apostrophes in email address From names by escaping them for the Postmark API.
	$from_regex = "/(\"From\": \"[a-zA-Z\\d]+)*[\\\\]{2,}'/";

	$args     = array(
		'headers' => array(
			'Accept'                  => 'application/json',
			'Content-Type'            => 'application/json',
			'X-Postmark-Server-Token' => $settings['api_key'],
		),
		'body'    => preg_replace( $from_regex, "'", wp_json_encode( $body ), 1 ),
	);
	$response = wp_remote_post( 'https://api.postmarkapp.com/email', $args );

	if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
		//echo"<pre>";print_r($response);echo"</pre>";
		//return false;
	}

	return true;
}

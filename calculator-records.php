<?php
if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class Mpc_Orders_List extends WP_List_Table {

	/** Class constructor */
	public function __construct() {

		parent::__construct( [
			'singular' => __( 'Calculator Record', 'sp' ), //singular name of the listed records
			'plural'   => __( 'Calculator Records', 'sp' ), //plural name of the listed records
			'ajax'     => false //should this table support ajax?

		] );

	}
    /**
     * Retrieve customer’s data from the database
     *
     * @param int $per_page
     * @param int $page_number
     *
     * @return mixed
     */
    public static function get_models( $per_page = 20, $page_number = 1 ) {
    
      global $wpdb;
    
      $sql = "SELECT * FROM {$wpdb->prefix}user_calculator_collections";
	  
	  if(!empty($_REQUEST['s_card']) ){
		  $s_card = $_REQUEST['s_card'];
		  $sql.=" WHERE full_name LIKE '%$s_card%' OR email_address LIKE '%$s_card%' OR order_id LIKE '%$s_card%'";
	  }
    
		if ( ! empty( $_REQUEST['orderby'] ) && $_REQUEST['orderby']=='qr_code' ) {
			$sql .= ' ORDER BY qc.qr_code';
			$sql .= ! empty( $_REQUEST['order'] ) ? ' ' . esc_sql( $_REQUEST['order'] ) : ' ASC';
		}else if ( ! empty( $_REQUEST['orderby'] ) ){
			$sql .= ' ORDER BY ' . esc_sql( $_REQUEST['orderby'] );
			$sql .= ! empty( $_REQUEST['order'] ) ? ' ' . esc_sql( $_REQUEST['order'] ) : ' ASC'; 
		}else if ( empty( $_REQUEST['orderby'] ) ){
			$sql .= ' ORDER BY id';
			$sql .= ! empty( $_REQUEST['order'] ) ? ' ' . esc_sql( $_REQUEST['order'] ) : ' DESC'; 
		}
    
      $sql .= " LIMIT $per_page";
    
      $sql .= ' OFFSET ' . ( $page_number - 1 ) * $per_page;
    
      $result = $wpdb->get_results( $sql, 'ARRAY_A' );
    
      return $result;
    }
    /**
     * Delete a customer record.
     *
     * @param int $id customer ID
     */
    public static function delete_model( $id ) {
      global $wpdb;
    
      $wpdb->delete(
        "{$wpdb->prefix}user_calculator_collections",
        [ 'id' => $id ],
        [ '%d' ]
      ); 
    }
	public static function publish_review( $id ) {
      global $wpdb;
		$wpdb->update("{$wpdb->prefix}user_calculator_collections",array(
			'review_status'=>1),
			array('id'=>$id)
		);
    }
	public static function unpublish_review( $id ) {
      global $wpdb;
    
		$wpdb->update("{$wpdb->prefix}user_calculator_collections",array(
			'review_status'=>0),
			array('id'=>$id)
		); 
    }
	
    /**
     * Returns the count of records in the database.
     *
     * @return null|string
     */
    public static function record_count() {
      global $wpdb;
    
      $sql = "SELECT COUNT(*) FROM {$wpdb->prefix}user_calculator_collections";
	  if(!empty($_REQUEST['s_card']) ){
		  $s_card = $_REQUEST['s_card'];
		  $sql.=" WHERE full_name LIKE '%$s_card%' OR email_address LIKE '%$s_card%' OR order_id LIKE '%$s_card%'";
	  }
    
      return $wpdb->get_var( $sql );
    }
    /** Text displayed when no customer data is available */
    public function no_items() {
      _e( 'No Location avaliable.', 'sp' );
    }
    /**
     * Method for name column
     *
     * @param array $item an array of DB data
     *
     * @return string
     */
    function column_order_id( $item ) {
    
		// create a nonce
		$delete_nonce = wp_create_nonce( 'sp_delete_model' );
		$title = '<strong>' . $item['order_id'] . '</strong>';
		$actions = [
		'delete' => sprintf( '<a href="?page=%s&action=%s&id=%s&_wpnonce=%s">delete</a>', esc_attr( $_REQUEST['page'] ), 'delete', absint( $item['id'] ), $delete_nonce )
		];
    
		return $title . $this->row_actions( $actions );
		//return $title;
    }
    /**
     * Render a column when no column specific method exists.
     *
     * @param array $item
     * @param string $column_name
     *
     * @return mixed
     */
    public function column_default( $item, $column_name ) {
      switch ( $column_name ) {
        case 'id':
		case 'available_assets':
		case 'assets_from_sale':
		case 'annual_gross_income':
		case 'credit_score':
		case 'county':
		case 'zip_code_cal':
			return $item[ $column_name ];	
		case 'user_id':
			$user_id = $item[ $column_name ];
				$user = get_user_by('id',$user_id);
			return $user->display_name;
		case 'email_status':
			return (($item[ $column_name ]==1) ? "Sent" : "Not Sent");
        default:
          return print_r( $item, true ); //Show the whole array for troubleshooting purposes
      }
    }
    /**
     * Render the bulk edit checkbox
     *
     * @param array $item
     *
     * @return string
     */
    function column_cb( $item ) {
      return sprintf(
        '<input type="checkbox" name="bulk-delete[]" value="%s" />', $item['id']
      );
    }
    /**
     *  Associative array of columns
     *
     * @return array
     */
    function get_columns() {
      $columns = [
        'cb'      => '<input type="checkbox" />',
        'user_id' => __( 'User Id', 'sp' ),
		'available_assets'    => __( 'Available Assets', 'sp' ),
		'assets_from_sale' => __( 'Assets From Sale', 'sp' ),
		'annual_gross_income' => __( 'Annual Gross Income', 'sp' ),
		'credit_score' => __( 'Credit Score', 'sp' ),
		'county' => __( 'County', 'sp' ),
		'zip_code_cal' => __( 'Zip Code', 'sp' ),
      ];
    
      return $columns;
    }
    /**
     * Columns to make sortable.
     *
     * @return array
     */
    public function get_sortable_columns() {
      $sortable_columns = array(
        'user_id' => array( 'user_id', true ),
        'available_assets' => array( 'available_assets', false ),
		'assets_from_sale' => array( 'assets_from_sale', false ),
		'annual_gross_income' => array( 'annual_gross_income', false ),
		'credit_score' => array( 'credit_score', false ),
		'county' => array( 'county', false ),
		'zip_code_cal' => array( 'zip_code_cal', false ),
      );
    
      return $sortable_columns;
    }
    /**
     * Returns an associative array containing the bulk action
     *
     * @return array
     */
    public function get_bulk_actions() {
      $actions = [
        'bulk-delete' => 'Delete'
      ];
    
      return $actions;
    }
    /**
     * Handles data query and filter, sorting, and pagination.
     */
    public function prepare_items() {
    
      $this->_column_headers = $this->get_column_info();
    
      /** Process bulk action */
      $this->process_bulk_action();
    
      $per_page     = $this->get_items_per_page( 'models_per_page', 20 );
      $current_page = $this->get_pagenum();
      $total_items  = self::record_count();
    
      $this->set_pagination_args( [
        'total_items' => $total_items, //WE have to calculate the total number of items
        'per_page'    => $per_page //WE have to determine how many items to show on a page
      ] );
    
    
      $this->items = self::get_models( $per_page, $current_page );
    }
    public function process_bulk_action() {
		//echo"<pre>";print_r($_REQUEST);echo"</pre>";die('sdfsdfdsf');
      //Detect when a bulk action is being triggered...
      if ( 'delete' === $this->current_action() ) {
    
        // In our file that handles the request, verify the nonce.
       
          self::delete_model( absint( $_GET['review'] ) );
    
        
    
      }
	    if ( 'unpublish' === $this->current_action() ) {
			self::unpublish_review( absint( $_GET['review'] ) );    
        }
	    if ( 'publish' === $this->current_action() ) {
			self::publish_review( absint( $_GET['review'] ) );    
        }
    
      // If the delete bulk action is triggered
      if ( ( isset( $_POST['action'] ) && $_POST['action'] == 'bulk-delete' )
           || ( isset( $_POST['action2'] ) && $_POST['action2'] == 'bulk-delete' )
      ) {
        
    
        $delete_ids = esc_sql( $_POST['bulk-delete'] );
    
        // loop over the array of record IDs and delete them
        foreach ( $delete_ids as $id ) {
          self::delete_model( $id );
    
        }
    
        
      }
    }

}

class mpcOrders_display {

	// class instance
	static $instance;

	// customer WP_List_Table object
	public $models_obj;

	// class constructor
	public function __construct() {
		add_filter( 'set-screen-option', [ __CLASS__, 'set_screen' ], 10, 3 );
		add_action( 'admin_menu', [ $this, 'plugin_menu' ] );
		add_action( 'admin_post_calculator_excel_export', [ $this, 'calculator_excel_export_function'] );
	}
	public static function set_screen( $status, $option, $value ) {
		return $value;
	}
	public function calculator_excel_export_function(){
		global $wpdb;
		include(plugin_dir_path( __FILE__ ).'phpexcel/PHPExcel.php');
		$objPHPExcel	=	new	PHPExcel();
		$brands = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}user_calculator_collections", ARRAY_A);
		//echo"<pre>";print_r($brands);echo"<pre>";die(" workingg");
		$objPHPExcel->setActiveSheetIndex(0);

		$objPHPExcel->getActiveSheet()->SetCellValue('A1', 'User ID');
		$objPHPExcel->getActiveSheet()->SetCellValue('B1', 'Available Assets');
		$objPHPExcel->getActiveSheet()->SetCellValue('C1', 'Assets From Sale');
		$objPHPExcel->getActiveSheet()->SetCellValue('D1', 'Annual Gross Income');
		$objPHPExcel->getActiveSheet()->SetCellValue('E1', 'Credit Score');
		$objPHPExcel->getActiveSheet()->SetCellValue('F1', 'County');
		$objPHPExcel->getActiveSheet()->SetCellValue('G1', 'County City');
		$objPHPExcel->getActiveSheet()->SetCellValue('H1', 'Zipcode cal');
		$objPHPExcel->getActiveSheet()->SetCellValue('I1', 'Monthly debt payment');
		$objPHPExcel->getActiveSheet()->SetCellValue('J1', 'Loan Type');
		$objPHPExcel->getActiveSheet()->SetCellValue('K1', 'period');
		$objPHPExcel->getActiveSheet()->SetCellValue('L1', 'property usage');
		$objPHPExcel->getActiveSheet()->SetCellValue('M1', 'property type');
		$objPHPExcel->getActiveSheet()->SetCellValue('N1', 'purchase history');
		$objPHPExcel->getActiveSheet()->SetCellValue('O1', 'estimated home value');
		$objPHPExcel->getActiveSheet()->SetCellValue('P1', 'street');
		$objPHPExcel->getActiveSheet()->SetCellValue('Q1', 'city');
		$objPHPExcel->getActiveSheet()->SetCellValue('R1', 'state');
		$objPHPExcel->getActiveSheet()->SetCellValue('S1', 'zip code');
		$objPHPExcel->getActiveSheet()->SetCellValue('T1', 'current mortgage balance');
		$objPHPExcel->getActiveSheet()->SetCellValue('U1', 'repairs andor credits');
		$objPHPExcel->getActiveSheet()->SetCellValue('V1', 'annual property tax amount');
		$objPHPExcel->getActiveSheet()->SetCellValue('W1', 'close the sale');
		$objPHPExcel->getActiveSheet()->SetCellValue('X1', 'for sale by owner');
		$objPHPExcel->getActiveSheet()->SetCellValue('Y1', 'calculate time');

		$objPHPExcel->getActiveSheet()->getStyle("A1:X1")->getFont()->setBold(true);

		$rowCount	=	2;
		foreach($brands as $key=>$row){
			$objPHPExcel->getActiveSheet()->SetCellValue('A'.$rowCount, mb_strtoupper($row['user_id'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('B'.$rowCount, mb_strtoupper($row['available_assets'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('C'.$rowCount, mb_strtoupper($row['assets_from_sale'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('D'.$rowCount, mb_strtoupper($row['annual_gross_income'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('E'.$rowCount, mb_strtoupper($row['credit_score'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('F'.$rowCount, mb_strtoupper($row['county'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('G'.$rowCount, mb_strtoupper($row['county_city'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('H'.$rowCount, mb_strtoupper($row['zip_code_cal'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('I'.$rowCount, mb_strtoupper($row['monthly_debt_payment'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('J'.$rowCount, mb_strtoupper($row['loan_type'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('K'.$rowCount, mb_strtoupper($row['period'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('L'.$rowCount, mb_strtoupper($row['property_usage'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('M'.$rowCount, mb_strtoupper($row['property_type'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('N'.$rowCount, mb_strtoupper($row['purchase_history'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('O'.$rowCount, mb_strtoupper($row['estimated_home_value'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('P'.$rowCount, mb_strtoupper($row['street'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('Q'.$rowCount, mb_strtoupper($row['city'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('R'.$rowCount, mb_strtoupper($row['state'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('S'.$rowCount, mb_strtoupper($row['zip_code'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('T'.$rowCount, mb_strtoupper($row['current_mortgage_balance'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('U'.$rowCount, mb_strtoupper($row['repairs_andor_credits'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('V'.$rowCount, mb_strtoupper($row['annual_property_tax_amount'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('W'.$rowCount, mb_strtoupper($row['close_the_sale'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('X'.$rowCount, mb_strtoupper($row['for_sale_by_owner'],'UTF-8'));
			$objPHPExcel->getActiveSheet()->SetCellValue('Y'.$rowCount, mb_strtoupper($row['calculate_time'],'UTF-8'));
			$rowCount++;
		}


		$objWriter	=	new PHPExcel_Writer_Excel2007($objPHPExcel);
		$name = "Calculator Records".date("Y-m-d H i s");

		header('Content-Type: application/vnd.ms-excel'); //mime type
		header('Content-Disposition: attachment;filename="'.$name.'.xlsx"'); //tell browser what's the file name
		header('Cache-Control: max-age=0'); //no cache
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');  
		$objWriter->save('php://output');
		//wp_redirect(admin_url("admin.php?page=calculator-records-page"));
		exit;
	}

	public function plugin_menu() {

		$hook = add_menu_page(
			'Calculator Records',
			'Calculator Records',
			'manage_options',
			'calculator-records-page',
			[ $this, 'plugin_mpc_orders_page' ],
			'dashicons-rest-api',
			2
		);

		add_action( "load-$hook", [ $this, 'screen_option' ] );

	}
/**
* Screen options
*/
public function screen_option() {

	$option = 'per_page';
	$args   = [
		'label'   => 'Calculator Records',
		'default' => 20,
		'option'  => 'mpc_per_page'
	];

	add_screen_option( $option, $args );

	$this->mpcOrders_obj = new Mpc_Orders_List();
}
/**
* Plugin settings page
*/
public function plugin_mpc_orders_page() {
    global $wpdb;
    //$brands = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}list_store_brands");
	?>
	<div class="wrap">
		<h1 class="wp-heading-inline">Calculator Records</h1>
		<div id="poststuff">
			<div id="post-body" class="metabox-holder columns-1">
				<div id="post-body-content">
					<div class="meta-box-sortables ui-sortable">
						<form method="POST" action="<?php echo admin_url( 'admin-post.php' ); ?>">
							<p class="search-box">
								<input type="hidden" name="action" value="calculator_excel_export" />
								<button class="button btn" type="submit">Export Data</button>
							</p>
						</form>
						<form method="get">
							<input type="hidden" name="page" value="<?php echo $_REQUEST['page'] ?>" />
							<p class="search-box">
							<?php /*
								<label class="screen-reader-text" for="search_id-search-input">
								search:</label> 
								<input id="search_id-search-input" type="text" name="s_card" value="<?php echo isset($_REQUEST['s_card']) ? $_REQUEST['s_card'] : "" ?>" /> 
								<input id="search-submit" class="button" type="submit" name="" value="search" /> */ ?>
								
							</p>
							<?php
							$this->mpcOrders_obj->prepare_items();
							$this->mpcOrders_obj->display(); ?>
						</form>
					</div>
				</div>
			</div>
			<br class="clear">
		</div>
	</div>
<?php
}
/** Singleton instance */
public static function get_instance() {
	if ( ! isset( self::$instance ) ) {
		self::$instance = new self();
	}

	return self::$instance;
}
}
add_action( 'init', function () {
    
	mpcOrders_display::get_instance();
} );
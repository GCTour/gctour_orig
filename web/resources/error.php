<?php




/**
 * @namespace GCTour\Error
 * @uri /error
 */
class ErrorResource extends Resource {
	
	private $tm;
	
	function __construct(){
		$this->tm = TemplateManager::getInstance();
	}
   
   
	function get($request) {
		$response = new Response($request);
		
		$db = Database::obtain();	
		$sql = "SELECT * FROM ".TABLE_ERRORS." ORDER BY first_submit";
		$errors = $db->fetch_array($sql);
		
		
		
		$error_array = array();
		foreach($errors as $error){	
			$error['versions'] = unserialize($error['versions']);
			$error_array[] = $error;
		}
		
		
		
		$this->tm->smarty->assign('title', "Errors");
		$this->tm->smarty->assign('errors', $error_array);
		
		$response->code = Response::OK;
		$response->addHeader('Content-type', 'text/html');
		$response->addHeader('charset', 'utf-8');
		$response->body = $this->tm->render('error');;
		
        return $response;        
    }
}

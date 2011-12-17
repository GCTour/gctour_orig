<?php

/**
 * @namespace GCTour\Errors
 * @uri /errors
 */
class ErrorsResource extends Resource {
	
	private $tm;
	
	function __construct(){
		$this->tm = TemplateManager::getInstance();
	}
   
   
	function get($request) {
    // make this only available to the admin
    Utilities::isAdmin();	  
	  
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
		$response->body = $this->tm->render('errors');
		
        return $response;        
    }
}

/**
 * @namespace GCTour\Errors\Show
 * @uri /errors/show/{id}
 */
class ErrorsShowResource extends Resource {
	
	private $tm;
  private $error_id;
	
	function __construct($parameters){
	  
	  $this->error_id = $parameters['id'];
    echo $this->error_id;

		$this->tm = TemplateManager::getInstance();
	}
   
   
	function get($request) {
    // make this only available to the admin
    Utilities::isAdmin();	  
	  
		$response = new Response($request);
		
		
		
		
		$db = Database::obtain();	
		$sql = "SELECT * FROM ".TABLE_ERRORS." WHERE `id` = ".$this->error_id;
		$error = $db->query_first($sql);
		
		// unserialize complex values
	  $error['versions'] = unserialize($error['versions']);
	  $error['useragents'] = unserialize($error['useragents']);
	  $error['gccodes'] = unserialize($error['gccodes']);
	  $error['lasttours'] = unserialize($error['lasttours']);
	  $error['usernotes'] = unserialize($error['usernotes']);

		
		
		$this->tm->smarty->assign('title', "Error - ".$error['exception']);
		$this->tm->smarty->assign('error', $error);
		
		$response->code = Response::OK;
		$response->addHeader('Content-type', 'text/html');
		$response->addHeader('charset', 'utf-8');
		$response->body = $this->tm->render('error_show');
		
    return $response;        
  }
}

<?php


/**
 * @namespace GCTour\Tour\JSON
 * @uri /tour/{webcode}/json
 */
class TourJSONResource extends Resource {
    
    protected $tm;
    private $webcode;
    
    function __construct($paramaters) {
		if(isset($paramaters['webcode'])){
			$this->webcode = $paramaters['webcode'];
		}
        $this->tm = TemplateManager::getInstance();
    }
    
    function get($request) {
		
		
		
		$response = new Response($request);
		
		$entitymanager = GeocacheManager::getInstance();
		$tour = $entitymanager->fetchTour($this->webcode); 
		$body = $tour->__toJSON();
				
		$response->code = Response::OK;
		$response->addHeader('Content-type', 'text/html');
		$response->addHeader('charset', 'utf-8');
		$response->body = $body;  
	
	   
		
		//~ $response->code = Response::OK;
		//~ $response->addHeader('Content-type', 'text/plain');
		//~ $response->body = json_encode($tour);

		
        return $response;
        
    }
    


    
}

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
		
  		
		
		if(!isset($tour)){ // tour nicht in DB enthalten -> Frage bei appengine an.
//		  $jsonurl = "http://192.168.178.10:8888/api/tour/".$this->webcode."/json";	
		  $jsonurl = "http://gctour-spot.appspot.com/api/tour/".$this->webcode."/json";	  
      $json = @file_get_contents($jsonurl,0,null,null);
      if($json !== false){ // internal server error etc.
        $json_output = json_decode($json);		
        if(@$json_output->webcode === $this->webcode){ // tour not on server
    		  $body = json_encode($json_output);
    		} else { // weder in db von madd.in noch GAE eine tour zum Webcode gefunden!
    		  $output = array();
    		  $output['type'] = "error";
    		  $output['message'] = "no tour";
    		  $output['webcode'] = $this->webcode;
    		  $body = json_encode((object)$output);
    		}
      } else { // damn appengine throws some error
        $output = array();
  		  $output['type'] = "error";
  		  $output['message'] = "no tour";
  		  $output['webcode'] = $this->webcode;
  		  $body = json_encode((object)$output);
      }
  	} else {
  	  $body = $tour->__toJSON();
  	}
  	
  	$response->code = Response::OK;
		$response->addHeader('Content-type', 'text/html');
		$response->addHeader('charset', 'utf-8');
		$response->body = $body;
  	
  		
  /*
		$body = $tour->__toJSON();
				
		  */
	
	   
		
		//~ $response->code = Response::OK;
		//~ $response->addHeader('Content-type', 'text/plain');
		//~ $response->body = json_encode($tour);

		
        return $response;
        
    }
    


    
}

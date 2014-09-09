<?php


/**
 * @namespace GCTour\downlo
 * @uri /download/{name}
 */
class GCTourDownloadResource extends Resource {
    
    private $version;
    private $name;
    
    function __construct($paramaters) {
		if(isset($paramaters['version'])){
			$this->version = $paramaters['version'];
		}
		if(isset($paramaters['name'])){
			$this->name = str_replace('..', 'foo', $paramaters['name']);
		}
    }
    
    function get($request) {
		
		$response = new Response($request);
		
		$response->code = Response::OK;
		$response->addHeader('Content-type', 'application/javascript');
		$response->addHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
		$response->addHeader('Pragma', 'no-cache');		
		$response->addHeader('Expires', '0');		
		
		if(isset($version)){
			
			if (file_exists('files/'.$name)) {
				$content = file_get_contents('files/'.$name, true);
				
							
			} else {
				$response->code = Response::NOTFOUND;
				$content = "File not found.";
			}
			
		} else {
			$content = file_get_contents('files/gctour.user.js', true);
			Utilities::incrementDownloads();
		}
		
		
		$response->body = $content;
		
		return $response;
    }
    


    
}

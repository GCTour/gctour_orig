<?php


/**
 * @namespace GCTour\Install
 * @uri /install
 */
class InstallResource extends Resource {
    
    protected $tm;
    function __construct() {
        $this->tm = TemplateManager::getInstance();
    }
    
    function get($request) {
        $response = new Response($request);
        
        
        
       $this->tm->smarty->assign('title', 'Installation');
        
        
        
        $body = $this->tm->render('install');
        
        
		$response->code = Response::OK;
		$response->addHeader('Content-type', 'text/html');
		$response->body = $body;

        return $response;
        
    }
   

    
}

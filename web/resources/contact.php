<?php


/**
 * @namespace GCTour\Contact
 * @uri /contact
 * @uri /contact/(error|success)
 */
class ContactResource extends Resource {
    
    protected $tm;
    
    private $error = false;    
    private $success = false;
    
    function __construct($parameters) {
        if(!empty($parameters)){
          $this->$parameters[0] = true;        
        }
        
        
        $this->tm = TemplateManager::getInstance();
    }
    
    function get($request) {
        $response = new Response($request);
        
        
        
       $this->tm->smarty->assign('title', 'Contact');
        
       $this->tm->smarty->assign('error', $this->error);        
       $this->tm->smarty->assign('success', $this->success);
        
        
        
        $body = $this->tm->render('contact');
        
        
		$response->code = Response::OK;
		$response->addHeader('Content-type', 'text/html');
		$response->body = $body;

        return $response;
        
    }
   

    
}

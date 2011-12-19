<?php


/**
 * @namespace GCTour\Index
 * @uri /
 * @uri /index
 */
class IndexResource extends Resource {
    
    protected $tm;
    
    function __construct() {
        
        $this->tm = TemplateManager::getInstance();
        
    }
    
    function get($request) {
        $response = new Response($request);
        
        
       
        $this->tm->smarty->assign('title', 'GCTour');
        
        
        
        $body = $this->tm->render('index');
        
        
        
        //~ $stats_data = Utilities::getStats();
        //~ 
        //~ $this->smarty->assign('test', $stats_data['installs']);
        //~ 
        //~ $this->smarty->assign('title', 'Smarty template');
        //~ $body = $this->render('index');
        
        
            $response->code = Response::OK;
            $response->addHeader('Content-type', 'text/html');
            $response->body = $body;
    
        return $response;
        
    }

    
}

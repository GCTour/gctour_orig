<?php


/**
 * @namespace GCTour\Stats
 * @uri /stats
 */
class StatsResource extends Resource {
    
    protected $tm;
    private $webcode;
    
    function __construct($paramaters) {
        $this->tm = TemplateManager::getInstance();
    }
    
    function get($request) {
        $response = new Response($request);	
     
     
        $data = Updates::getVersionStats(30);
  			$this->tm->smarty->assign('title', 'Statistics');
        	$this->tm->smarty->assign('output', $data);
        
        
        
        
        
        
  			$response->code = Response::OK;
  			$response->addHeader('Content-type', 'text/html');
  			$response->body = $this->tm->render('stats');	
  		
      return $response;
    }
}

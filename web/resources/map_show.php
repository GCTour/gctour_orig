<?php
include_once 'lib/smarty/Smarty.class.php';

/**
 * @namespace GCTour\API\Map\Show
 * @uri /map/show/{entitycodes}/{options}/{maptype}
 */
class MapShowResource extends Resource {
   
	protected $smarty;
    

    
    /**
     * Handle a POST request for this map save ressource
     * @param Request request
     * @return Response
     */
    function get($request,$entitycodes,$options,$maptype) {
		
		
		$this->smarty = new Smarty();
		$this->smarty->template_dir = './representations';
		$this->smarty->compile_dir = sys_get_temp_dir();	
		
		
		$response = new Response($request);
		$gccodes_array = explode(",", $entitycodes);
		$entitymanager = GeocacheManager::getInstance();
            
           
        	
	
		$this->smarty->assign('title', 'Show the map');
        
        
        
        
        
		$geocaches = array();
        $ownWaypoints = array();
        
        $geocacheIds = array();
        $ownWaypointsIds = array();
        
        $index = 0;
        
		foreach(explode(",", $entitycodes) as $entitycode){
			
			if($this->startsWith($entitycode, "GC")){
				$geocacheIds[] = $entitycode;
				
				$geocache = $entitymanager->fetchGeocache($entitycode);
				//~ $resp.= $entitycode.":".print_r($geocache,true)."\n";
				//~ $resp.= $entitycode.":".$geocache->__toJSON()."\n";
				//~ $resp.= $entitycode.":".json_encode($geocache)."\n";
				if(isset($geocache)){					
					$geocache->i = $index;
					$index = $index + 1;
					$geocaches[] = json_encode($geocache);
				}
			} else {				
				$ownWaypointsIds[] = $entitycode;
				$ownWaypoint = $entitymanager->fetchOwnWaypoints($entitycode);
				//~ $resp.= $entitycode.":".json_encode($ownWaypoint)."\n";
				if(isset($ownWaypoint)){
					$ownWaypoint->i = $index;
					$index = $index + 1;
					$ownWaypoints[] = json_encode($ownWaypoint);
				}
			}
		}
		
		
		if(empty($geocaches) && empty($own_Waypoints)){
			
		
			$response->addHeader('Content-type', 'text/html');
			$response->addHeader('charset', 'utf-8');
			
			$this->smarty->assign('geocacheIds', $geocacheIds);
			$this->smarty->assign('ownWaypointsIds', $ownWaypointsIds);
			
			$body = $this->smarty->fetch('map_error.html');
			
			$response->code = Response::NOTFOUND;
			$response->addHeader('Content-type', 'text/html');
			$response->addHeader('charset', 'utf-8');
			$response->body = $body;
			
		} else {
			$this->smarty->assign('settings', $options);
			$this->smarty->assign('maptype', $maptype);
			$this->smarty->assign('geocaches', implode(",", $geocaches));
			$this->smarty->assign('ownWaypoints', implode(",", $ownWaypoints));
			
			$body = $this->smarty->fetch('map_show.html');
			
			$response->code = Response::OK;
			$response->addHeader('Content-type', 'text/html');
			$response->addHeader('charset', 'utf-8');
			$response->body = $body;
			
		}
		
        return $response;
        
    }
    
    function startsWith($haystack, $needle)
	{
		$length = strlen($needle);
		return (substr($haystack, 0, $length) === $needle);
    }
    
   
}

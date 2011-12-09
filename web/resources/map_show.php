<?php
include_once 'lib/smarty/Smarty.class.php';

/**
 * @namespace GCTour\API\Map\Show
 * @uri /map/show/h/{hash}/{options}/{maptype}
 * @uri /map/show/e/{entitycodes}/{options}/{maptype}
 * @uri /map/show/tour/{webcode}
 */
class MapShowResource extends Resource {
   
    private $tm;
    private $em;
    private $entitycodes;
    private $hash;
    private $options;
    private $maptype;
    private $webcode;
    
    
    function __construct($paramaters) {		
      foreach($paramaters as $key => $value){
        $this->$key = $value;
      }	    	
      $this->tm = TemplateManager::getInstance();
      $this->em = GeocacheManager::getInstance();
    }

    
     function get($request){
       $response = new Response($request);       
       
      if(isset($this->webcode)){ // show a tour 
      
         $tour = $this->em->fetchTour($this->webcode);       
        if(!isset($tour)){ // check if webcode exists
          $this->tm->smarty->assign('webcode', $this->webcode);
          $body = $this->tm->render('tour_error', 'html', false);				
          $response->code = Response::NOTFOUND;				
        } else {
          $merged_tour = $tour->merge(); // merge Geocaches and OwnWaypoints into one array in right order
          $geocaches_json = array();
          $ownWaypoints_json = array();
        	
          foreach($merged_tour as $index => $marker){
            $marker->i = $index;
            if(get_class($marker) === 'Geocache'){				
              $geocaches_json[] = json_encode($marker);
            } else if (get_class($marker) === 'OwnWaypoint'){				
              $ownWaypoints_json[] = json_encode($marker);
            } else {
              die("kein datentyp:".get_class($marker));
            }
          }
        	 
          $this->tm->smarty->assign('title', $tour->name ." - ". $tour->webcode);
          $this->tm->smarty->assign('settings', '111111101');
          $this->tm->smarty->assign('maptype', 'osmde');
          $this->tm->smarty->assign('geocaches', implode(",", $geocaches_json));
          $this->tm->smarty->assign('ownWaypoints', implode(",", $ownWaypoints_json));
        	
          $body = $this->tm->render('map_show','html', false);
          $response->code = Response::OK;
        } 
      } else if(isset($this->entitycodes) || isset($this->hash)) { // get a map using the given entitycodes
        if(isset($this->hash)){
          
          $db = Database::obtain();
          $sql = "SELECT entities FROM ".TABLE_MAPTEMP." WHERE `hash`='".$this->hash."'";
          $row = $db->query_first($sql);
          
          $entitycodes_array = explode(",", $row['entities']); 
        } else {
          $entitycodes_array = explode(",", $this->entitycodes);  
        }            
        
        
  			 
  			 
        $this->tm->smarty->assign('title', 'GCTour Map');
  			
        $geocaches_json = array();
        $ownWaypoints_json = array();
  			
        $geocacheIds = array();
        $ownWaypointsIds = array();
  			
        $index = 0;
  			
        foreach($entitycodes_array as $entitycode){
  				
          if(startsWith($entitycode, "GC")){
            $geocacheIds[] = $entitycode;
  					
            $geocache = $this->em->fetchGeocache($entitycode);
            if(isset($geocache)){					
              $geocache->i = $index;
              $index = $index + 1;
              $geocaches_json[] = json_encode($geocache);
            }
          } else {				
            $ownWaypointsIds[] = $entitycode;
            $ownWaypoint = $this->em->fetchOwnWaypoints($entitycode);
            if(isset($ownWaypoint)){
              $ownWaypoint->i = $index;
              $index = $index + 1;
              $ownWaypoints_json[] = json_encode($ownWaypoint);
            }
          }
        }
  			
  			
        if(empty($geocaches_json) && empty($ownWaypoints_json)){
  			
          $response->addHeader('Content-type', 'text/html');
          $response->addHeader('charset', 'utf-8');
  				
          $this->tm->smarty->assign('geocacheIds', $geocacheIds);
          $this->tm->smarty->assign('ownWaypointsIds', $ownWaypointsIds);
  				
          $body = $this->tm->render('map_error', 'html', false);
  				
          $response->code = Response::NOTFOUND;				
        } else {
          $this->tm->smarty->assign('settings', $this->options);
          $this->tm->smarty->assign('maptype', $this->maptype);
          $this->tm->smarty->assign('geocaches', implode(",", $geocaches_json));
          $this->tm->smarty->assign('ownWaypoints', implode(",", $ownWaypoints_json));
  				
          $body = $this->tm->render('map_show', 'html', false);
  				
          $response->code = Response::OK;		
        }
  			
       }
  		 
      $response->addHeader('Content-type', 'text/html');
      $response->addHeader('charset', 'utf-8');
      $response->body = $body;
  			
  		
  		
       return $response;
     }
     
     
    private function showTour(){
      $response = new Response($request);

      
      return $response;
    }
    
      /**
     * Handle a GET request for this map show ressource
     * @param Request request
     * @return Response
     */
     
     /*
    function get($request,$entitycodes,$options,$maptype,$webcode) {
		
		
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
    */
   
}

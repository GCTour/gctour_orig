<?php

/**
 * @namespace GCTour\API\Map\Save
 * @uri /map/save
 */
class MapSaveResource extends Resource {
    
    /**
     * Handle a POST request for this map save ressource
     * @param Request request
     * @return Response
     */
    function post($request) {
		$response = new Response($request);
		
		if (isset($_POST['map'])) {
            // Remove those slashes
            if(get_magic_quotes_gpc())
				      $map = stripslashes($_POST['map']);
            else
				      $map = $_POST['map'];
         
            $map_obj = json_decode($map);
            $geocacheManager = GeocacheManager::getInstance();
            
           
            $geocaches =  $geocacheManager->parseGeocaches($map_obj->{"geocaches"});
      			foreach ($geocaches as $geocache){
      				$geocache->save();
      			}    

            
            $ownWaypoints = $geocacheManager->parseOwnWaypoints($map_obj->{"costumMarkers"});
            foreach ($ownWaypoints as $ownWaypoint){
      				$ownWaypoint->save();
      			}
           
            
            $response->code = Response::OK;
            $response->addHeader('Content-type', 'text/plain');
            $response->body = print_r($map,true);
        } else {
            $response->code = Response::BADREQUEST;
		}
		
        return $response;
        
    }
   
}

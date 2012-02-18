<?php
include_once 'lib/smarty/Smarty.class.php';

/**
* @namespace GCTour\API\Map\Make
* @uri /map/make
*/
class MapMakeResource extends Resource {
  private $tm;
  private $em;
  private $hash;
  
  function post($request) {
    $response = new Response($request);
		
		if (isset($_POST['ids'])) {
		  
		
		  
		  
      $ids = $_POST['ids'];
      $hash = md5($_POST['ids']);
      
		  $data = array();
		  $data['hash'] = $hash;
      $data['entities'] = $_POST['ids'];
      
      $db = Database::obtain();
		  $db->replace(TABLE_MAPTEMP, $data);
		  
		  // delete hash codes created minimal 1 day ago
		  $sql = "delete from `".TABLE_MAPTEMP."` where `created` < now() - interval 1 day";
		  $db->query($sql);
		  
      $response->code = Response::OK;
      $response->addHeader('Content-type', 'text/plain');
      $response->body = $hash;
          
    } else {
      $response->code = Response::BADREQUEST;
		}
    
    return $response;
  }
}

<?php

 // TemplateManager ist Singleton-Klasse
 final class TemplateManager {
 
   // Anlegen der Instanz
   private static $instance = NULL;
 
	public $smarty;
 
   // Konstruktor private, damit die Klasse nur aus sich selbst heraus instanziiert werden kann.
   private function __construct() {
        $this->smarty = new Smarty();
        $this->smarty->template_dir = './representations';
        $this->smarty->compile_dir = sys_get_temp_dir();
	}
 
   // Diese statische Methode gibt die Instanz zurueck.
   public static function getInstance() {
 
       if (NULL === self::$instance) {
           self::$instance = new self;
       }
       return self::$instance;
   }
   // Klonen per 'clone()' von außen verbieten.
   private function __clone() {}
   
   
       
    public function render($view, $format = 'html', $useShell = TRUE) {
        
        
        
        if ($format == 'html' && $useShell) {
			
			// fetch meta data
			$stats_data = Utilities::getStats();
			//~ print_r($stats_data);
			//~ 
			 $this->smarty->assign('version', $stats_data['version']);
			 $this->smarty->assign('build', $stats_data['build']);
			 $this->smarty->assign('release_date', $stats_data['release_date']->format("d M Y"));
			 $this->smarty->assign('installs', $stats_data['installs']);
			 $this->smarty->assign('bugfixes', $stats_data['bugfixes']);
			 $this->smarty->assign('view', $view);
			
            $this->smarty->assign('body', $this->smarty->fetch($view.'.'.$format));
            return $this->smarty->fetch('shell.'.$format);
        } else {
            return $this->smarty->fetch($view.'.'.$format);
        }
        
    }
   
    
   
}



 // GeocacheManager ist Singleton-Klasse
 final class GeocacheManager {
 
   // Anlegen der Instanz
   private static $instance = NULL;
 
   // Konstruktor private, damit die Klasse nur aus sich selbst heraus instanziiert werden kann.
   private function __construct() {}
 
   // Diese statische Methode gibt die Instanz zurueck.
   public static function getInstance() {
 
       if (NULL === self::$instance) {
           self::$instance = new self;
       }
       return self::$instance;
   }
   // Klonen per 'clone()' von außen verbieten.
   private function __clone() {}
    
   
	
	function fetchGeocache($gcid){
		$db = Database::obtain();
		$sql="SELECT * FROM `".TABLE_GEOCACHES."` WHERE `gcid`='".$gcid."'";
		$row = $db->query_first($sql);
		
		if(!empty($row['gcid'])){		
			
			 //~ $hex='';
			//~ for ($i=0; $i < strlen($row['name']); $i++)
			//~ {
				//~ $hex .= $row['name'][$i].":".dechex(ord($row['name'][$i]))."\n";
			//~ }
			
			$geocache = new Geocache($row);
			$geocache->setWaypoints($this->fetchWaypoints($geocache->getGCCode()));
			return $geocache;
		} else {
			return;
		}
	}
	
	
	function fetchTour($webcode){
		$webcode = strtoupper($webcode);
		$db = Database::obtain();
		$sql="SELECT * FROM `".TABLE_TOURS."` WHERE `webcode`='".$webcode."'";
		$row = $db->query_first($sql);
		if(!empty($row['webcode'])){
			$sql="SELECT * FROM `".TABLE_GEOCACHESINTOUR."` WHERE `webcode`='".$webcode."'";
			$gcids = $db->fetch_array($sql);
			
			$geocaches = array();
			foreach($gcids as $gcid){
				$geocaches[] = $this->fetchGeocache($gcid['gcid']);
			}
			
			
			$sql="SELECT * FROM `".TABLE_OWNWAYPOINTSINTOUR."` WHERE `webcode`='".$webcode."'";
			$ownWaypointsLine = $db->fetch_array($sql);	
			
			$ownWaypoints = array();
			foreach($ownWaypointsLine as $ownWaypointCode){
				$ownWaypoints[] = $this->fetchOwnWaypoints($ownWaypointCode['wptcode']);
			}
			
			$sql="SELECT name FROM `".TABLE_TOURS."` WHERE `webcode`='".$webcode."'";
			$tour_line = $db->query_first($sql);
				
			$data = array();
			$data["geocaches"] = $geocaches;
			$data["ownWaypoints"] = $ownWaypoints;
			$data["name"] = $tour_line["name"];
			$data["webcode"] = $webcode;
			
			return new Tour($data);
		} else { // tour is not in database
		
	    $jsonurl = "http://gctour-spot.appspot.com/api/tour/".strtolower($webcode)."/json";	
	    $json = @file_get_contents($jsonurl,0,null,null);
      
      if($json !== false){ // no internal server error etc.
        $json_output = json_decode($json);		
        if(@$json_output->webcode === strtolower($webcode)){ // tour not on server
          return new OldTour(array(
            'webcode' => $json_output->webcode,
            'json_rep' => $json
          ));     
        
    		  $body = json_encode($json_output);
    		} else { // weder in db von madd.in noch GAE eine tour zum Webcode gefunden!
          return new JSONMessage(array(
            'type' => 'error',  
            'message' => 'no tour'
          ));  
    		}
      } else { // appengine throws some error
        return new JSONMessage(array(
            'type' => 'error',  
            'message' => 'no tour'
        ));
      }
		
			return;
		}
	}
	
	
	function fetchOwnWaypoints($wptcode){
		$db = Database::obtain();
		$sql="SELECT * FROM `".TABLE_OWNWAYPOINTS."` WHERE `wptcode`='".$wptcode."' ORDER BY `index`";
		$row = $db->query_first($sql);
		if(!empty($row['wptcode'])){
			$ownWaypoint = new OwnWaypoint($row);
			return $ownWaypoint;
		} else {
			return;
		}
	}
	
	function fetchWaypoints($gcid){
		$db = Database::obtain();
		$sql="SELECT * FROM `".TABLE_WAYPOINTS."` WHERE `gcid`='".$gcid."'";
		
		
		$waypoints = array();
		
		// feed it the sql directly. store all returned rows in an array
		$rows = $db->fetch_array($sql);
		foreach($rows as $waypointProperties){			
			unset($waypointProperties['id']);
			unset($waypointProperties['gcid']);
			$waypoint = new Waypoint($waypointProperties);
			$waypoints[] = $waypoint;
		}
		
		return $waypoints;
	 }
    
    function parseGeocaches($geocacheArray) {
		$geocaches = array();
		foreach ($geocacheArray as $geocache){
			$geocacheObject = new Geocache(array(
				'gcid' => $geocache->{"gcid"},
				'guid' => $geocache->{"guid"},
				'name' => $geocache->{"name"},
				'type' => $geocache->{"image"},
				'latitude' => $geocache->{"latitude"},
				'longitude' => $geocache->{"longitude"},
				'terrain' => $geocache->{"terrain"},
				'difficulty' => $geocache->{"difficulty"},
				'additional_waypoints' => $this->parseWaypoints($geocache->{"additional_waypoints"})
			));
			$geocaches[] = $geocacheObject;
		}
		return $geocaches;
	}
	
	 function parseWaypoints($waypointArray) {
		$waypoints = array();
		foreach ($waypointArray as $waypoint){
			@$waypointObject = new Waypoint(array(
				'symbol' => $waypoint->{"symbol"},
				'prefix' => $waypoint->{"prefix"},
				'lookup' => $waypoint->{"lookup"},
				'name' => $waypoint->{"name"},
				'latitude' => $waypoint->{"latitude"},
				'longitude' => $waypoint->{"longitude"},
				'note' => $waypoint->{"note"}
			));
			$waypoints[] = $waypointObject;
		} 		
		return $waypoints;
	 }
	 
	 function parseOwnWaypoints($ownWaypointArray) {
		$ownWaypoints = array();
		foreach ($ownWaypointArray as $ownWaypoint){
			$ownWaypointObject = new OwnWaypoint(array(
				'wptcode' => $ownWaypoint->{"wptcode"},
				'name' => $ownWaypoint->{"name"},
				'latitude' => $ownWaypoint->{"latitude"},
				'longitude' => $ownWaypoint->{"longitude"},
				'content' => $ownWaypoint->{"content"},
				'index' => $ownWaypoint->{"index"},
				'image' => $ownWaypoint->{"image"},
				'symbol' => $ownWaypoint->{"symbol"}
			));
			
				       	 
			$ownWaypoints[] = $ownWaypointObject;
		} 		
		return $ownWaypoints;
	 }
    
 }


class JSONMessage{
  public $type;
  public $message;  
  
  function __construct($properties){
  	foreach($properties as $key => $value){
			$this->$key = $value;
		}
  }  
  
  function __toJSON(){
    return json_encode($this);  
  }
   
}

class Waypoint{
	public $symbol;
	public $prefix;
	public $lookup;
	public $name;
	public $latitude;
	public $longitude;
	public $note;
	
	function __construct($properties){
		foreach($properties as $key => $value){
			$this->$key = $value;
		}
	}
	
	function save($toGeocache){
		$data = get_object_vars($this);
		$data["gcid"]=$toGeocache->getGCCode();
		$data["id"]=$this->prefix.$toGeocache->getGCCode();
		
		$db = Database::obtain();
		$db->replace(TABLE_WAYPOINTS, $data);
		
	}
	function __toString(){
		return "AdditionalWaypoint!";
	}
	
}

class OwnWaypoint{	
	public $wptcode;
	public $name;
	public $latitude;
	public $longitude;
	public $content;
	public $index;
	public $image;
	public $symbol;
	
	function __construct($properties){
		foreach($properties as $key => $value){
			$this->$key = $value;
		}
	}
	
	function save(){
		$data = get_object_vars($this);
		$db = Database::obtain();
		$db->replace(TABLE_OWNWAYPOINTS, $data);
	}
	
	function __toString(){
		return "OwnWaypoint!";
	}
	
}


class OldTour{

  public $webcode;
  public $json_rep;  
  
  function __construct($properties){
		foreach($properties as $key => $value){
			$this->$key = $value;
		}
	}
  
  function __toJSON(){
    return $this->json_rep;  
  }
  
}

class Tour{	
	public $name;
	public $webcode;
	public $geocaches;
	public $ownWaypoints;
	
	function __construct($properties){
		foreach($properties as $key => $value){
			$this->$key = $value;
		}
	}
	
	function merge(){
		$merged = $this->geocaches;
		
		foreach($this->ownWaypoints as $ownWaypoint){
			array_insert($merged, $ownWaypoint, $ownWaypoint->index);
		}
		
		return $merged;
		
	}
	
	function getTypes(){
		$types = array();
		
		foreach($this->geocaches as $geocache){
			@$types[$geocache->typeNo()] = $types[$geocache->typeNo()]+1;
		}
		
		if(sizeof($this->ownWaypoints) > 0){
			$types['owpt'] = sizeof($this->ownWaypoints);
		}
		return $types;
	}
	
	function __toJSON(){
		$merged_tour = $this->merge();
		
		
		$data = array();
		$data['name'] = $this->name;
		$data['webcode'] = $this->webcode;
		$data['geocaches'] = array();
		
		// create geocache and waypoint objects!!
		foreach($merged_tour as $marker){
			$marker_obj = array();
			if(get_class($marker) === 'Geocache'){
				$marker_obj['id'] = $marker->gcid;
				$marker_obj['guid'] = $marker->guid;
				$marker_obj['name'] = $marker->name;
				$marker_obj['image'] = 'http://www.geocaching.com/images/WptTypes/sm/'.$marker->typeNo().'.gif';
				
				$data['geocaches'][] = (object) $marker_obj;
				
			} else if (get_class($marker) === 'OwnWaypoint'){				
				//~ $ownWaypoints_json[] = json_encode($marker);
				$marker_obj['wptcode'] = $marker->wptcode;
				$marker_obj['name'] = $marker->name;
				$marker_obj['latitude'] = $marker->latitude;
				$marker_obj['longitude'] = $marker->longitude;
				$marker_obj['image'] = $marker->image;
				$marker_obj['content'] = $marker->content;
				$marker_obj['symbol'] = $marker->symbol;
				
				$data['geocaches'][] = (object) $marker_obj;
				
			} else {
				die("kein datentyp:".get_class($marker));
			}
		}
		
		return json_encode((object)$data);
	}
		
	
	function save(){
		
		
		$db = Database::obtain();
		
		// delete the old tour
		$sql ="DELETE FROM ".TABLE_GEOCACHESINTOUR." WHERE `webcode` = '".$this->webcode."'";
		$db->query($sql);
		
		$sql ="DELETE FROM ".TABLE_OWNWAYPOINTSINTOUR." WHERE `webcode` = '".$this->webcode."'";
		$db->query($sql);
		
		$data = array();
		$data["webcode"] = $this->webcode;
		
		foreach($this->geocaches as $geocache){
			$geocache->save();
				
			$data["gcid"] = $geocache->gcid;			
			$db->insert(TABLE_GEOCACHESINTOUR, $data);
			
		}
		
		$data = array();
		$data["webcode"] = $this->webcode;
		foreach($this->ownWaypoints as $ownWaypoint){
			
			$ownWaypoint->save();
				
			$data["wptcode"] = $ownWaypoint->wptcode;			
			$db->insert(TABLE_OWNWAYPOINTSINTOUR, $data);
			
		}
		
		
		$data = array();
		$data["webcode"] = $this->webcode;
		$data["name"] = $this->name;
		$db->replace(TABLE_TOURS, $data);
		
		
	}
	
	function __toString(){
		return print_r($this,true);
	}
	
}

/**
 * Model the data of the Geocaching Object
 * @namespace GCTour\Lib
 */
class Geocache
{
	public $gcid;
	public $guid;
	public $name;
	public $type;
	public $latitude;
	public $longitude;
	public $terrain;
	public $difficulty;
	public $additional_waypoints;
				



	function __construct($properties) {
		foreach($properties as $key => $value){
			$this->$key = $value;
		}
	}
	
	
	function save(){
		// save geocache first
		$data = get_object_vars($this);
		unset($data["additional_waypoints"]);
		$db = Database::obtain();
		$db->replace(TABLE_GEOCACHES, $data);

		
		// after saving geocaches - save the AdditionalWaypoints
		foreach ($this->additional_waypoints as $waypoint){
			$waypoint->save($this);
		}
	}
	
	function setWaypoints($waypoints){
		$this->additional_waypoints = $waypoints;		
	}
	
	function getGCCode(){
		return $this->gcid;
	}	
	
	function typeNo(){
		
		$type = explode('/',$this->type);
		$type = array_pop($type);
		$type = explode('.',$type);
		$type = $type[0];
		
		return $type;
	}	
	
	function __toString(){
		return "(".$this->gcid.") - ".$this->name."\n";
	}
    
}


final class Utilities {
  
  
  public static function isAdmin() {
    
    session_start();
    
    
    if (
      isset($_SESSION['USER']) && $_SESSION['USER'] == ADMIN_USER &&
      isset($_SESSION['PASS']) && $_SESSION['PASS'] == ADMIN_PASS
    ) {
      return TRUE;
    } else {
      return FALSE;
    }
  }
  
  public static function checkAdmin() {
    
    session_start();   
    
    if (
      isset($_SESSION['USER']) && $_SESSION['USER'] == ADMIN_USER &&
      isset($_SESSION['PASS']) && $_SESSION['PASS'] == ADMIN_PASS
    ) {
      return;
    } else {
      throw new ResponseException('ACCESS DENIED!', Response::UNAUTHORIZED);  
    }
    
  }
	public static function incrementDownloads(){
		
			$db = Database::obtain();
			$sql="SELECT * FROM `".TABLE_VERSIONS."` ORDER BY build DESC";
			$row = $db->query_first($sql);
			
			
			$data = array();
			$data['installs_till'] = "INCREMENT(1)";
			$db->update(TABLE_VERSIONS, $data, "build='".$row["build"]."'");
	}
	
	public static function getStats(){
		
		$db = Database::obtain();
		
		$sql="SELECT * FROM `".TABLE_VERSIONS."` ORDER BY build DESC";
		$row = $db->query_first($sql);	
		
		
		$stats_data = array();
		
		$stats_data["installs"] = $row["installs_till"];
		$stats_data["release_date"] = new Datetime($row["release_date"]);
		$stats_data["version"] = $row["version"];
		$stats_data["build"] = $row["build"];
		$stats_data["bugfixes"] = $row["bugfixes"];
		

		return $stats_data;
	}

}

final class Updates {

  public static function getVersions(){
    $db = Database::obtain();
    $sql = "SELECT * FROM `".TABLE_VERSIONS."` ORDER BY `build` DESC";
    $rows = $db->fetch_array($sql);
    
    return $rows;
  }

  public static function getUpdates($version, $build){
    $db = Database::obtain();
    $sql = "SELECT * FROM `".TABLE_VERSIONS."` WHERE `build`>'".$build."' ORDER BY `build` DESC";

    $version_array = array();
    $version_array['changes'] = array();
    
    $rows = $db->fetch_array($sql);

    if(empty($rows)){
      $message = array();
      $message['message'] = "no updates";
      return (object) $message;      
      
    } else {          
      $version_array['version'] = $rows[0]['version'];
      $version_array['build'] = $rows[0]['build'];
      $version_array['update'] = "http://gctour.madd.in/download/gctour.user.js";
      foreach ($rows as $record) {
        $version = array();
        $version['version'] = $record['version'];
        $version['build'] = $record['build'];
        $version['changes'] = preg_split("/(\r?\n)/", $record['bugfixes']);
        $version_array['changes'][] = (object) $version;
      }
      return (  object) $version_array;
    }    
  } 
}



// Global Helper functions

function startsWith($haystack, $needle){
	$length = strlen($needle);
	return (substr($haystack, 0, $length) === $needle);
}

function array_insert(&$array, $insert, $position = -1) {
     $position = ($position == -1) ? (count($array)) : $position ;
     if($position != (count($array))) {
          $ta = $array;
          for($i = $position; $i < (count($array)); $i++) {
               if(!isset($array[$i])) {
                    die(print_r($array, 1)."\r\nInvalid array: All keys must be numerical and in sequence.");
               }
               $tmp[$i+1] = $array[$i];
               unset($ta[$i]);
          }
          $ta[$position] = $insert;
          $array = $ta + $tmp;
          //print_r($array);
     } else {
          $array[$position] = $insert;
     }

     ksort($array);
     return true;
}





?>

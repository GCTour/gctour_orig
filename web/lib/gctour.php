<?php


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
			
		
			
			
			 $hex='';
			for ($i=0; $i < strlen($row['name']); $i++)
			{
				$hex .= $row['name'][$i].":".dechex(ord($row['name'][$i]))."\n";
			}
			
			$geocache = new Geocache($row);
			$geocache->setWaypoints($this->fetchWaypoints($geocache->getGCCode()));
			return $geocache;
		} else {
			return;
		}
	}
	
	
	function fetchOwnWaypoints($wptcode){
		$db = Database::obtain();
		$sql="SELECT * FROM `".TABLE_OWNWAYPOINTS."` WHERE `wptcode`='".$wptcode."'";
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
			
			echo "name:".$geocache->{"name"};
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
			$waypointObject = new Waypoint(array(
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
	
	function __toString(){
		return "(".$this->gcid.") - ".$this->name."\n";
	}
    
}




?>

<?php

/**
 * @namespace GCTour\Errors\Send
 * @uri /errors/send
 */
class ErrorsSendResource extends Resource {
   
   
	function post($request) {
		$response = new Response($request);
		
		
		
		if (isset($_POST['exception'])) {
		  
      if(get_magic_quotes_gpc())
	      $lasttour = stripslashes($_POST['lastTour']);
      else
	      $lasttour = $_POST['lastTour'];		  
		  
		  
			$db = Database::obtain();
			
			$exception = $_POST['exception'];
			
	
			$sql="SELECT * FROM `".TABLE_ERRORS."` WHERE `exception`='".$exception."'";
			$row = $db->query_first($sql);
			if(empty($row['id'])){ // first error report!
				$data = array();
				
				// save version with the appereance
				$versions = array($_POST['version'] => 1);
				$useragents = array(
					$_POST['username'] => $_POST['userAgent']
				);
				
				$gccodes = array(
					$_POST['username'] => $_POST['gccode']
				);
				
				 
				$lastTours = array(
				  $_POST['username'] => $lasttour
				);
				
				$notes = array();
				if(!empty($_POST['userNote'])){
					$notes[$_POST['username']." (".date('d.m.Y G:i:s').")"] = $_POST['userNote'];
				}
				
				$data['exception'] = $_POST['exception'];
				$data['versions'] = serialize($versions);
				$data['useragents'] = serialize($useragents);
				$data['gccodes'] = serialize($gccodes);
				$data['lasttours'] = serialize($lastTours);				
			  $data['usernotes'] = serialize($notes);
				$data['appearance'] = "1";
				
				
				$primary_id = $db->insert(TABLE_ERRORS, $data);
				
				
				$post = $primary_id;
			

			} else { // an aditional error report
				
				$data = array();
				
				$versions = unserialize($row['versions']);
				
				if(isset($versions[$_POST['version']])){
				  $versions[$_POST['version']] = $versions[$_POST['version']]+1;
				} else {
				  $versions[$_POST['version']] = 1;
				}
				
				
				$versions = array_unique($versions); // make version unique to prevent
				
				$useragents = unserialize($row['useragents']);
				$useragents[$_POST['username']] = $_POST['userAgent'];
				
			
				$gccodes = unserialize($row['gccodes']);
				$gccodes[$_POST['username'] ] = $_POST['gccode'];
				
			  $lastTours = unserialize($row['lasttours']);
				$lastTours[$_POST['username'] ] = $lasttour;

				if(!empty($_POST['userNote'])){
					$notes = unserialize($row['usernotes']);
					if(!is_array($notes))
					  $notes = array();
					  
					$notes[$_POST['username']." (".date('d.m.Y G:i:s').")"] = $_POST['userNote'];
					$data['usernotes'] = serialize($notes);
				}
				
				// save only the last 10 entries for the gccodes and useragents
				if(sizeof($gccodes) >10){
					$gccodes = array_slice($gccodes,-10); // offset is negative, the sequence will start that far from the end of the array
					$useragents = array_slice($useragents,-10);
					$lastTours = array_slice($lastTours,-10);
				}
				
				
				$data['id'] = $row['id'];
				$data['versions'] = serialize($versions);
				$data['useragents'] = serialize($useragents);
				$data['gccodes'] = serialize($gccodes);				
				$data['lasttours'] = serialize($lastTours);
				$data['appearance'] = "INCREMENT(1)";
				
				$post = print_r($data,true);
				
				// update vs replace: update unterstützt INCREMENT(1)!
				$db->update(TABLE_ERRORS, $data, "id = '".$row['id']."'");
				
			}
			
/*	POST	
Array
(
    [redir] => http://www.geocaching.com/default.aspx?
    [version] => 2.1.11321
    [exception] => ReferenceError: getKaese is not defined
    [gccode] => GC2FYVR
    [errorSource] => GPX error
    [username] => Zwergpiraten
    [userAgent] => Mozilla/5.0 (X11; Linux x86_64; rv:8.0) Gecko/20100101 Firefox/8.0
    [lastTour] => %7B%22webcode%22:%224ab69345%22,%22name%22:%22Tour%2071%22,%22uuid%22:%22214edbaa-249e-480d-aaa7-f37de5c1f39f%22,%22geocaches%22:%5B%7B%22guid%22:%22c81c119c-2e40-4eb5-9794-758d95438544%22,%22id%22:%22GC2J3M7%22,%22name%22:%22Runde%20Ecke%22,%22image%22:%22http://www.geocaching.com/images/WptTypes/sm/3.gif%22%7D,%7B%22guid%22:%22c81c119c-2e40-4eb5-9794-758d95438544%22,%22id%22:%22GC2FYVR%22,%22name%22:%2220%20Jahre%20Deutsche%20Einheit%22,%22image%22:%22http://www.geocaching.com/images/WptTypes/sm/3.gif%22%7D,%7B%22id%22:%22GC1NDBF%22,%22name%22:%22Marienkirche%20Leipzig%20-%20St%C3%B6tteritz%22,%22guid%22:%22bc87d997-2423-4c30-ae93-d01ea91ce65f%22,%22image%22:%22http://www.geocaching.com/images/WptTypes/sm/2.gif%22%7D%5D,%22id%22:87%7D
    [userNote] => 
)
*/
			
			
            //~ $tour = $_POST['tour'];
            //~ $version = $_POST['versio'];
         //~ 
            //~ $tour_obj = json_decode($tour);
            
            	//~ <input type="hidden" name="version" value="'+VERSION+'.'+BUILD+'" >\
		//~ <input type="hidden" name="exception" value="'+options._exception+'" >\
		//~ <input type="hidden" name="gccode" value="'+GM_getValue("debug_lastgcid","")+'" >\
		//~ <input type="hidden" name="errorSource" value="'+options.caption+'" >\
		//~ <input type="hidden" name="username" value="'+userName+'" >\
		//~ <input type="hidden" name="userAgent" value="'+unsafeWindow.navigator.userAgent+'" >\
		//~ <input type="hidden" name="lastTour" value="'+encodeURI(JSON.stringify(currentTour))+'">';
          
            
            $response->code = Response::OK;
            $response->addHeader('Content-type', 'text/plain');
            $response->body = $post ;
        } else {
            $response->code = Response::BADREQUEST;
            
    		}
      return $response;
        
    }
}

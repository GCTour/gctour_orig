<?php

/**
 * @namespace GCTour\Upadte
 * @uri /update
 */
class UpdateResource extends Resource {
    
  protected $tm;
  function __construct() {
    $this->tm = TemplateManager::getInstance();
  }
  
  function get($request) {
    $response = new Response($request);
    $this->tm->smarty->assign('title', 'Updates');


    $versions = Updates::getVersions();
    $this->tm->smarty->assign('versions',$versions);

    $body = $this->tm->render('update');    
    $response->code = Response::OK;
    $response->addHeader('Content-type', 'text/html');
    $response->body = $body;    
    return $response;
  
  }
    
    /**
     * Handle a POST request for the update
     * @param Request request
     * @return Response
     */
    function post($request) {
		$response = new Response($request);
		
		
/*
{ "build" : 11313,
  "changes" : [ { "build" : 11313,
        "changes" : [ "FIXED: GPX Download bug \"...ctl00_hlSignOut... is undefined\"",
            "FIXED: Issue 18",
            "FIXED: bug after gc.com update",
            "NEW: Update added link in the error-Dialog",
            "NEW: User can write a message in the error-Dialog"
          ],
        "version" : 2.1000000000000001
      },
      { "build" : 11293,
        "changes" : [ "FIXED: <=3 Logs in printout -> \"Last4Logs\" (L4L) in the printout",
            "FIXED: Logs in GPX (Unicode hexadez.)",
            "UPDATED: dutch translation",
            "Add jQuery (1.6.4) and jQuery-ui (1.8.16)"
          ],
        "version" : 2.1000000000000001
      },
      { "build" : 11285,
        "changes" : [ "FIXED: autoTour",
            "FIXED: GCTour on the search page",
            "FIXED: Logs in printout",
            "FIXED: Logs in GPX",
            "UPDATED: french translation",
            "GPX: New Groundspeak implementation to prevent XML errors",
            "NEW: Titlepage in the printview now contains coordinates and basic informations",
            "NEW: printview contains now the PM cache note!",
            "NEW: delete button for current tour",
            "NEW: 'Last4Logs' (L4L) has been added to the printout - similar to http://www.gsak.net/help/hs11980.htm"
          ],
        "version" : 2.1000000000000001
      }
    ],
  "script" : "gctour",
  "update" : "http://userscripts.org/scripts/source/36273.user.js",
  "version" : 2.1000000000000001
}	

{ "build" : "11313",
  "changes" : [ { "build" : "11313",
        "changes" : [ "eine test Zeile",
            "noch eine Zeile",
            "und noch ein super FIX!!"
          ],
        "version" : "2.1"
      },
      { "build" : "11311",
        "changes" : [ "Version 2.1.11311 Changes",
            "haben viel getan",
            "und auch nichts geändert!"
          ],
        "version" : "2.1"
      },
      { "build" : "11310",
        "changes" : [ "chnages 2.0",
            "naja - ein wenig sonderzeichen",
            "()"
          ],
        "version" : "2.0"
      }
    ],
  "version" : "2.1"
}

*/
		
      if (isset($_POST['update'])) {
        $update_obj = json_decode($_POST['update']);
        
        $updates = Updates::getUpdates($update_obj->{'version'},$update_obj->{'build'});
         
         
        $response->code = Response::OK;
        $response->addHeader('Content-type', 'text/plain');
        $response->body =  json_encode($updates);
      } else {
        $response->code = Response::BADREQUEST;
      }
      
      return $response;
        
    }
   
}

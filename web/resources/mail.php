<?php

/**
 * @namespace GCTour\API\Mail
 * @uri /mail/{from}
 */
class MailResource extends Resource {
    
    /**
     * Handle a POST request for this map save ressource
     * @param Request request
     * @return Response
     */
    function post($request, $action) {
      
      $response = new Response($request);
      
    /*  print_r($_POST);
echo $action;*/

     	
      switch($action) {
        case 'website':
          $type = $_POST['type'];
    		  $name = $_POST['name'];
          $email = $_POST['email'];
          $content = $_POST['content'];
          $checkedEmail = str_replace(array("\n", "\r"), '', $email);              
        
          if($name == "" || $type == "" || $email == "" || $content == "" ){
            $location = '/contact/error';
          } else {
            mail("gctour.martin@googlemail.com", "[WEBSITE] ".$type, "Name: ".$name."\nEMail: ".$email."\n\n".$content, "From: ".$checkedEmail);
            $location = '/contact/success';
          }       
        
          break;
        case 'gccom':
          $redir = $_POST['redir'];
          $username = $_POST['user'];
          $message = $_POST['message'];
          $responsemail = $_POST['responsemail'];
          
          if($responsemail == ""){
			  mail("gctour.martin@googlemail.com", "[GEO] ".$username, $message, "From: ".$username."@geocaching.com");
		  } else {
			  mail("gctour.martin@googlemail.com", "[GEO] ".$username, $message, "From: ".$responsemail);
		  }
          
          $location = $redir;        
             
          break;
        default:
          
        }
        
      header('Location: '.$location); 
      return;   
  }
}

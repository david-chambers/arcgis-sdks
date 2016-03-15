require([
    "esri/map", "application/bootstrapmap","esri/arcgis/Portal", "esri/arcgis/OAuthInfo", "esri/IdentityManager",
    "dojo/dom-style", "dojo/dom-attr", "dojo/dom", "dojo/on", "dojo/_base/array","esri/layers/FeatureLayer", "dojo/dom-style", 
    "dojo/domReady!"
  ], function (Map, bootstrapmap, arcgisPortal, OAuthInfo, esriId,
    domStyle, domAttr, dom, on, arrayUtils, FeatureLayer, domStyle){

    //Global variable for resultsArray (object array of all AGOL items), map and appID.
    var resultsArray, map, appID, info;

    //OAuthInfo to store appId
    var info = new OAuthInfo({
      appId: appID,
      popup: true
    });
    esriId.registerOAuthInfos([info]);

    //Check if user is signed in already
    esriId.checkSignInStatus(info.portalUrl + "/sharing").then(
      function (){
        
        displayItems();
      }
    ).otherwise(
      function (){
        // Anonymous view
        console.log("in anonymous view - no user logged in");
        
      }
    );

    //Listen for the sign-in button to be clicked
  	on(dom.byId("sign-in"), "click", function (){
      console.log("signing in...");
      appID = document.getElementById("appid").value;

      info.appId = appID; 

      esriId.registerOAuthInfos([info]);

      console.log("appid: " + appID);
      esriId.getCredential(info.portalUrl + "/sharing", {
          oAuthPopupConfirmation: false
        }
      ).then(function (){
          displayItems();
        });
  	});




    //displayItems called from sign-in click event
    function displayItems(){
      console.log("in displayItems");

      //Hide the jumbotron
      //Set the serviceDropdown list to visible (hidden initially)
      document.getElementById('primary-message-callout').style.display = "none";

      //Hide the Steps
      document.getElementById('toHide2').style.display = "none";

      new arcgisPortal.Portal(info.portalUrl).signIn().then(
        function (portalUser){
          
          window.alert("Welcome " + portalUser.fullName);

          //query the portal for content if sign in success
          queryPortal(portalUser)
        }

        ).otherwise(
          function (error){
            console.log("Error occurred while signing in: ", error);
          }
        );
    }

    function queryPortal(portalUser){
      var portal = portalUser.portal;

      var queryParams = {
        q: "owner:" + portalUser.username,
        sortField: "numViews",
        sortOrder: "title",
        num: 100
      };

      //After querying call createDropdownList
      portal.queryItems(queryParams).then(createDropdownList)


    }

    function createDropdownList(items){

      resultsArray = (items.results);
      console.log(resultsArray);


      var bootstrapSelect = document.getElementById("serviceDropdown2");
      var bootstrapSelectJQuery = $("#serviceDropdown2");

      for(var i = 0; i < resultsArray.length; i++){
        if(resultsArray[i].displayName === "Feature Layer"){
          console.log(resultsArray[i].title);
          

          var htmlFragment = "<li><a href=\"#\">" + resultsArray[i].title + "</a></li>";
          bootstrapSelectJQuery.append(htmlFragment);

        }
      }

      loadMap();
    }


    //event handler for bootstrap dropdown to add services
    $('#serviceDropdown2').on('click', "li", function(){
      var serviceUrlForSelection;
      console.log($(this).text());
      var selection = $(this).text();

      //Loop through the array of results to find object with cooresponding name selected
      for(var i=0; i < resultsArray.length; i++){
        if(resultsArray[i].displayName === "Feature Layer"){
          if(resultsArray[i].title === selection){
            console.log(resultsArray[i]);
            serviceUrlForSelection = resultsArray[i].url;
            console.log("Url is: " + serviceUrlForSelection);

          }
        }
      };

      //todo: figure out how to detect /layer-id and add/remove
      var lastTwoCharactersURL = serviceUrlForSelection.slice(-2);
      console.log(lastTwoCharactersURL);

      if(lastTwoCharactersURL == "/0"){
        console.log("this has a index!");
        map.addLayer(new FeatureLayer(serviceUrlForSelection));
      } else{
        console.log("this doesn't have an index");
        map.addLayer(new FeatureLayer(serviceUrlForSelection + "/0"));
      }

      //Add selection to the map
      //map.addLayer(new FeatureLayer(serviceUrlForSelection));
      


    });

    function loadMap(){

      //Set the serviceDropdown list to visible (hidden initially)
      //domStyle.set("serviceDropdown","visibility", "visible")
      domStyle.set("add-data-dropdown", "visibility", "visible");
      // Get a reference to the ArcGIS Map class
      map = bootstrapmap.create("mapDiv",{
        basemap: "osm",
        center:[-97.69, 39.09],
        zoom:5,
        scrollWheelZoom: false
      });

    }

  });
    

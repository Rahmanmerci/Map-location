import { LightningElement,api, track } from 'lwc';
import ACCOUNT from "@salesforce/schema/Account";
import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Account.Id';
import LATITUDE_FIELD from '@salesforce/schema/Account.Latitude__c';
import LONGITUDE_FIELD from '@salesforce/schema/Account.Longitude__c';
export default class CurrentLocation extends LightningElement {

    @api recordId;
    lstMarkers = [];
    zoomlevel = "1";

    vfUrl ='/apex/dragMapMarkerPage?';
    mainIframeUrl='';
    latitude = 28.61;
    longitude = 77.21;

    //------------------

    objApi=ACCOUNT;

    billingStreetVal;
    billingCityVal;
    billingStateVal;
    billingZipVal; 
    billingCountryval;

    billingStreethand(event){
        this.billingStreetVal = event.target.value;
    }
    billingCityhand(event){
        this.billingCityVal = event.target.value;
    }
    billingStatehand(event){
        this.billingStateVal = event.target.value;
    }
    billingZiphand(event){
        this.billingZipVal = event.target.value;
    }
    billingCountryhand(event){
        this.billingCountryval = event.target.value;
    }

    connectedCallback(){
        
        if (navigator.geolocation) {
            
            navigator.geolocation.getCurrentPosition(position => {
                
                // Get the Latitude and Longitude from Geolocation API
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;

                
                let href = window.location.href;
                this.mainIframeUrl = this.vfUrl+'latitude='+this.latitude+'&longitude='+this.longitude+'&host=classic';
                if(href.includes("lightning.force.com")){
                    this.mainIframeUrl = this.vfUrl+'latitude='+this.latitude+'&longitude='+this.longitude+'&host=lightning';
                }
                window.addEventListener( "message", this.handleCoordinates.bind(this), false);
                    });
                    console.log('AFTER HANDLE CLICK EVENT');
                }
        
    }
    
    onSave(){
        const fields = {};
    fields[ID_FIELD.fieldApiName] = this.recordId;
    fields[LATITUDE_FIELD.fieldApiName] = this.latitude;
    fields[LONGITUDE_FIELD.fieldApiName]= this.longitude;
    const recordInput = { fields };
    updateRecord(recordInput)
    .then(() => {console.log('Record Updated');})
}

    handleCoordinates(message){
        if(message.data != null){
            let coords = message.data;
            this.latitude = coords.slice(0, coords.indexOf(":"));
            this.longitude = coords.slice(coords.indexOf(":")+1, coords.length);
            console.log(this.latitude);
            console.log(this.longitude);
        }
    }
}
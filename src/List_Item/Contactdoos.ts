import { Electro_Item } from './Electro_Item';
import { SVGelement } from '../SVGelement';

class Contactdoos extends Electro_Item {

    convertLegacyKeys(mykeys: Array<[string,string,any]>) {
        this.props.type                           = this.getLegacyKey(mykeys,0);
        this.props.is_geaard                      = this.getLegacyKey(mykeys,1);
        this.props.is_kinderveilig                = this.getLegacyKey(mykeys,2);
        this.props.aantal                         = this.getLegacyKey(mykeys,4);
        this.props.nr                             = this.getLegacyKey(mykeys,10);
        this.props.adres                          = this.getLegacyKey(mykeys,15);
        this.props.aantal_fases_indien_meerfasig  = this.getLegacyKey(mykeys,16);
        this.props.heeft_ingebouwde_schakelaar    = this.getLegacyKey(mykeys,19);
        this.props.is_halfwaterdicht              = this.getLegacyKey(mykeys,20);
        this.props.is_meerfasig                   = this.getLegacyKey(mykeys,21);
        this.props.heeft_nul_indien_meerfasig     = this.getLegacyKey(mykeys,25);
        this.props.in_verdeelbord                 = this.getLegacyKey(mykeys,26);
    }

    resetProps() {
        this.clearProps();
        this.props.type = "Contactdoos";
        this.props.is_geaard = true;    
        this.props.is_kinderveilig = true; 
        this.props.aantal = "1";     
        this.props.adres = "";     
        this.props.aantal_fases_indien_meerfasig = "3";  
        this.props.heeft_ingebouwde_schakelaar = false;
        this.props.is_halfwaterdicht = false;
        this.props.is_meerfasig = false;
        this.props.heeft_nul_indien_meerfasig = false;
        this.props.in_verdeelbord = false;
    }

    toHTML(mode: string) {
        let output = this.toHTMLHeader(mode);

        output += "&nbsp;Nr: " + this.stringPropToHTML('nr',5) + ", "
               +  "Geaard: " + this.checkboxPropToHTML('is_geaard') + ", "
               +  "Kinderveiligheid: " + this.checkboxPropToHTML('is_kinderveilig') + " "
               +  "Halfwaterdicht: " + this.checkboxPropToHTML('is_halfwaterdicht') + ", "
               +  "Meerfasig: " + this.checkboxPropToHTML('is_meerfasig') + ", ";

        if (this.props.is_meerfasig) {
          output += "Aantal fasen: " + this.selectPropToHTML('aantal_fases_indien_meerfasig',["1","2","3"]) + ", "
                 +  "Met nul: " + this.checkboxPropToHTML('heeft_nul_indien_meerfasig') + ", ";
        };

        output += "Ingebouwde schakelaar: " + this.checkboxPropToHTML('heeft_ingebouwde_schakelaar') + ", "
               +  "Aantal: " + this.selectPropToHTML('aantal',["1","2","3","4","5","6"]) + ", "
               +  "In verdeelbord: " + this.checkboxPropToHTML('in_verdeelbord')
               +  ", Adres/tekst: " + this.stringPropToHTML('adres',5);

        return(output);
    }

    toSVG() {
        let mySVG:SVGelement = new SVGelement();

        mySVG.xleft = 1; // Links voldoende ruimte voor een eventuele kring voorzien
        mySVG.xright = 20; // We starten met breedte 20 (leidings links) en vullen later aan in functie van wat moet getekend worden
        mySVG.yup = 25;
        mySVG.ydown = 25;

        var startx: number = 1; // Punt waar we aan het tekenen zijn. Schuift gaandeweg op

        // Teken lijnen voor meerfasige contactdoos
        if (this.props.is_meerfasig) {
          mySVG.data += '<line x1="1" y1="25" x2="35" y2="25" stroke="black" />';

          switch (this.props.aantal_fases_indien_meerfasig) { //faselijnen
            case "1":
                mySVG.data += '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />';
                break;
            case "2":
                mySVG.data += '<line x1="16.5" y1="35" x2="22.5" y2="15" stroke="black" />'
                           +  '<line x1="22.5" y1="35" x2="28.5" y2="15" stroke="black" />';
                break;
            case "3":
                mySVG.data += '<line x1="15" y1="35" x2="21" y2="15" stroke="black" />'
                           +  '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />'
                           +  '<line x1="27" y1="35" x2="33" y2="15" stroke="black" />';
                break;
            default:
                mySVG.data += '<line x1="21" y1="35" x2="27" y2="15" stroke="black" />';
                break;
          }
          
          if (this.props.heeft_nul_indien_meerfasig) { //nullijn
            mySVG.data += '<line x1="39" y1="35" x2="45" y2="15" stroke="black" />'
                       +  '<circle cx="39" cy="35" r="2" fill="black" stroke="black" />';
          }

          startx += 34; mySVG.xright += 34; //We schuiven alles 34 pixels op
        }

        // Teken ingebouwde schakelaar
        if (this.props.heeft_ingebouwde_schakelaar) { 
            mySVG.data += '<line x1="' + (startx + 0) + '" y1="25" x2="' + (startx + 11) + '" y2="25" stroke="black" />'
                       +  '<line x1="' + (startx + 30) + '" y1="25" x2="' + (startx + 20) + '" y2="5" stroke="black" />'
                       +  '<line x1="' + (startx + 20) + '" y1="5" x2="' + (startx + 15) + '" y2="7.5" stroke="black" />'
                       +  '<line x1="' + (startx + 22) + '" y1="9" x2="' + (startx + 17) + '" y2="11.5" stroke="black" />';

            startx += 10; mySVG.xright += 10; //We schuiven alles 10 pixels op
        }

        // Teken alle contactdozen, inclusief aarding en kinderveiligheid indien van toepassing
        for (let i=0; i<this.props.aantal; ++i) {
            mySVG.data += '<use xlink:href="#contactdoos" x="' + startx + '" y="25"></use>';
            if (this.props.is_geaard) mySVG.data += '<use xlink:href="#contactdoos_aarding" x="' + startx + '" y="25"></use>';
            if (this.props.is_kinderveilig) mySVG.data += '<use xlink:href="#contactdoos_kinderveilig" x="' + startx + '" y="25"></use>';
            startx += 20; mySVG.xright += 20;
        }

        // Teken kader indien in verdeelbord
        if (this.props.in_verdeelbord) {
            mySVG.data += '<rect x="' + (mySVG.xright - this.props.aantal * 20 - 3 - (this.props.heeft_ingebouwde_schakelaar) * 12) + '" y="3" width="' + (this.props.aantal * 20 + 6 + (this.props.heeft_ingebouwde_schakelaar) * 12) + '" height="44" fill="none" style="stroke:black" />';
                       +  '<line x1="' + (17 + (mySVG.xright-20+3)) + '" y1="3" x2="' + (17 + (mySVG.xright-20+3)) + '" y2="47" fill="none" style="stroke:black" />';
        };  

        // Teken halfwaterdicht indien van toepassing
        if (this.props.is_halfwaterdicht) mySVG.data += '<rect x="' + (22+(this.props.heeft_ingebouwde_schakelaar)*10+(this.props.is_meerfasig)*34) + '" y="0" width="6" height="8" style="fill:rgb(255,255,255)" /><text x="' + (25+(this.props.heeft_ingebouwde_schakelaar)*10+(this.props.is_meerfasig)*34) + '" y="8" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10">h</text>';

        // Indien de contactdoos een kind heeft, teken een streepje rechts
        if (this.heeftVerbruikerAlsKind()) {
            mySVG.data += '<line x1="'+startx+'" y1="25" x2="'+(startx+21)+'" y2="25" stroke="black" />';
        };
       
        // Adres helemaal onderaan plaatsen
        mySVG.data += this.addAddressToSVG(mySVG,60,15);
        mySVG.data += "\n";

        return(mySVG);
    }

}
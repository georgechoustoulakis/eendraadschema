class Electro_Item extends List_Item {

  constructor(mylist: Hierarchical_List) { // This is legacy but we will live with it for now until we completely removed the key-concept
    super(mylist);
    this.resetProps(); // In Javascript, this calls the derived classes
  }

  // -- Lees oude legacy keys (enkel voor EDS versies 001 en 002) --

  getLegacyKey(mykeys: Array<[string,string,any]>, keyid: number) {
    if ( (typeof(mykeys) != 'undefined') && (mykeys.length>keyid) ) {
      return mykeys[keyid][2];
    } else {
      return null;
    }
  }

  // -- Converteer oud key-based systeem (EDS versies 1 en 2) --

  convertLegacyKeys(mykeys: Array<[string,string,any]>) {} // Do nothing if not defined in derived class

  // -- Na creatie van een item, zet alle props op default waarden --

  resetProps() { super.resetProps(); } // overriden in each derived class

  // -- Zoek vader van het Electro_Item --
  
  getParent(): Electro_Item { 
      return(super.getParent() as Electro_Item);
  }

  // -- Lijst met toegestande kinderen van het Electro_item --

  allowedChilds() : Array<string> { 
      return ["", "Aansluiting", "Domotica", "Domotica gestuurde verbruiker", "Meerdere verbruikers", "Splitsing", "---", "Batterij", "Bel", "Boiler", "Contactdoos", "Diepvriezer", "Droogkast", "Drukknop", "Elektriciteitsmeter", "Elektrische oven", "EV lader", "Ketel", "Koelkast", "Kookfornuis", "Lichtcircuit", "Lichtpunt", "Microgolfoven", "Motor", "Omvormer", "Overspanningsbeveiliging", "Schakelaars", "Stoomoven", "Transformator", "USB lader", "Vaatwasmachine", "Ventilator", "Verlenging", "Verwarmingstoestel", "Verbruiker", "Vrije tekst", "Warmtepomp/airco", "Wasmachine", "Zonnepaneel", "---", "Aansluitpunt", "Aftakdoos", "Leeg", "Zeldzame symbolen"];
  }

  // -- Aantal actieve kinderen van het Electro_item --

  getNumChildsWithKnownType() : number {
      let numChilds = 0;
      if (this.sourcelist != null) {
          for (let i=0; i<this.sourcelist.data.length; ++i) {
              if ( (this.sourcelist.data[i].parent === this.id) && (this.sourcelist.active[i]) 
                && ((this.sourcelist.data[i] as Electro_Item).getType() != "") ) numChilds++;
          }  
      }
      return(numChilds);
  }

  // -- Check of Electro_item een kind heeft --

  heeftKindMetGekendType() : boolean {
    return(this.getNumChildsWithKnownType() > 0);
  }

  // -- Check of [item] een vrije tekst zonder kader is --

  isVrijeTekstZonderKader() : boolean {
    if (this.getType() == "Vrije tekst") {
      if (this.props.vrije_tekst_type == "zonder kader") return true; else return false;
    } else return false;
  }

  // -- Check of er een streepje moet geplaatst worden achter bepaalde elementen zoals een contactdoos of lichtpunt --

  heeftVerbruikerAlsKind() : boolean {
    let parent = this.getParent();

    if ( (parent != null) && ((parent as Electro_Item).getType() == "Meerdere verbruikers") ) {
        let myOrdinal = this.sourcelist.getOrdinalById(this.id);
        let lastOrdinal = 0;
        for (let i = 0; i<this.sourcelist.data.length; ++i) {
            if (this.sourcelist.active[i] && !((this.sourcelist.data[i] as Electro_Item).isVrijeTekstZonderKader()) && (this.sourcelist.data[i].parent == this.parent)) lastOrdinal = i;
        }
        if (lastOrdinal > myOrdinal) return true; else return false; 
    } else {
        if (this.sourcelist != null) {
            for (let i=0; i<this.sourcelist.data.length; ++i) {
                if ( (this.sourcelist.data[i].parent === this.id) && 
                     (this.sourcelist.active[i]) && !((this.sourcelist.data[i] as Electro_Item).isVrijeTekstZonderKader()) && 
                     ((this.sourcelist.data[i] as Electro_Item).getType() != "") && ((this.sourcelist.data[i] as Electro_Item).getType() != null) ) return true;
            }  
        }
    }  

    return false;
  }

  // -- Maak het huidige Electro_item een copy van source_item --

  clone(source_item: List_Item) {

    this.parent = source_item.parent;
    this.indent = source_item.indent;
    this.collapsed = source_item.collapsed;
    this.sourcelist = source_item.sourcelist;

    this.props = deepClone((source_item as Electro_Item).props);  
  }

  // -- Type van het Electro_item teruggeven --

  getType() : string { return this.props.type; }

  //-- Clear all keys, met uitzondering van nr indien er een nummer is --

  clearProps() {
      let oldnr: string;
      if (typeof(this.props.nr) != 'undefined') oldnr = this.props.nr; else oldnr = "";
      this.props = {};
      this.props.nr = oldnr;
  }

  // -- Returns the maximum number of childs the Electro_Item can have --

  getMaxNumChilds(): number {
    let parent: Electro_Item = this.getParent();
    if (parent == null) return 256; //This should never happen, all allowed childs of null have their own implementations of getMaxNumChilds() and will never call this.
    switch ((parent as Electro_Item).getType()) {
      case "Meerdere verbruikers": return 0;  break;  // Childs of "Meerdere verbruikers" cannot have childs
      default:                     return 1;  break;  // By default, most element can have 1 child unless overwritten by derived classes
    } 
  }

  // -- Returns true if the Electro_Item can take an extra childs --

  checkInsertChild() { return(this.getMaxNumChilds() > this.getNumChilds()); }

  // -- Returns true if the parent can take an extra child --

  checkInsertSibling() {
    let parent: Electro_Item = this.getParent();
    if (parent == null) return true;
    else return(parent.getMaxNumChilds() > parent.getNumChilds());
  }

  // -- Displays the navigation buttons for the Electro_Item, i.e. the green and blue arrows, and the selection of the Type (Bord, Kring, ...) --

  toHTMLHeader(mode: string) {
    let output:string = "";
    
    if (mode=="move") {
      output += "<b>ID: "+this.id+"</b>, ";
      output += 'Moeder: <input id="id_parent_change_' + this.id + '" type="text" size="2" value="' + this.parent + '" onchange="HL_changeparent(' + this.id + ')"> ';
      output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveUp(" + this.id +")\">&#9650;</button>";
      output += " <button style=\"background-color:lightblue;\" onclick=\"HLMoveDown(" + this.id +")\">&#9660;</button>";
      if (this.checkInsertSibling()) {
        output += " <button style=\"background-color:lightblue;\" onclick=\"HLClone(" + this.id +")\">Clone</button>";
      }
    } else {
      if (this.checkInsertSibling()) {
        output += " <button style=\"background-color:green;\" onclick=\"HLInsertBefore(" + this.id +")\">&#9650;</button>";
        output += " <button style=\"background-color:green;\" onclick=\"HLInsertAfter(" + this.id +")\">&#9660;</button>";
      }
      if (this.checkInsertChild()) {
        output += " <button style=\"background-color:green;\" onclick=\"HLInsertChild(" + this.id +")\">&#9654;</button>";
      }
    };
    output += " <button style=\"background-color:red;\" onclick=\"HLDelete(" + this.id +")\">&#9851;</button>";
    output += "&nbsp;"

    let parent:Electro_Item = this.getParent();
    let consumerArray;
    
    if (parent == null) consumerArray = ["", "Kring", "Aansluiting"];
    else consumerArray = this.getParent().allowedChilds()

    output += this.selectPropToHTML('type', consumerArray);

    return(output);
  }

  // -- This one will get called if the type of the Electro_Item has not yet been chosen --

  toHTML(mode: string) { return(this.toHTMLHeader(mode)); } // Implemented in the derived classes

  // -- Code to add the addressline below when drawing SVG. This is called by most derived classes --

  addAddressToSVG(mySVG: SVGelement, starty:number = 60, godown:number = 15, shiftx:number = 0): String {
    let returnstr:string;
    if (!(/^\s*$/.test(this.props.adres))) { //check if adres contains only white space
      returnstr = '<text x="' + ((mySVG.xright-20)/2 + 21 + shiftx) + '" y="' + starty + '" style="text-anchor:middle" font-family="Arial, Helvetica, sans-serif" font-size="10" font-style="italic">' + htmlspecialchars(this.props.adres) + '</text>';
      mySVG.ydown = mySVG.ydown + godown;
    }
    return returnstr;
  }

  // -- Make the SVG for the electro item, placeholder for derived classes --

  toSVG(): SVGelement { return(new SVGelement()); } //Placeholder for derived classes
}

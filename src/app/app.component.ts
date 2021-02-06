import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  searchKey: string;
  infoData: any;
  searchType: any;
  inputType: any;
  radio1: any;
  radio2: any;
  loading = false;

  searchBy = [
    { name: 'type (alcoholic/non alcoholic)', type: 'radio', options: ['Alcoholic', 'Non Alcoholic'] },
    { name: 'category (ordinary drink / cocktail)', type: 'radio', options: ['Ordinary Drink', 'Cocktail'] },
    { name: 'glass (cocktail glass/champagne flute)', type: 'radio', options: ['Cocktail Glass', 'Champagne Flute'] },
    { name: 'cocktail name', type: 'input' },
    { name: 'cocktails first letter', type: 'input' },
    { name: 'ingredient  name', type: 'input' }]

  constructor(private http: HttpClient) { }


  getQueryParams() {
    switch (this.searchType) {
      case "type (alcoholic/non alcoholic)":
        return { queryString: 'a', queryType: 'filter' }
      case "category (ordinary drink / cocktail)":
        return { queryString: 'c', queryType: 'filter' }
      case "glass (cocktail glass/champagne flute)":
        return { queryString: 'g', queryType: 'filter' }
      case "cocktail name":
        return { queryString: 's', queryType: 'search' }
      case "cocktails first letter":
        return { queryString: 'f', queryType: 'search' }
      case "ingredient  name":
        return { queryString: 'i', queryType: 'search' }
    }
  }

  onSubmit() {
    let { queryType, queryString } = this.getQueryParams()
    var url = `https://www.thecocktaildb.com/api/json/v1/1/${queryType}.php?${queryString}=` + this.searchKey
    this.loading = true;
    this.http.get(url).subscribe(data => {
      var key = Object.keys(data)
      this.loading = false;
      var drinkData = data[key[0]];
      if (key[0] == 'drinks') {
        for (let i = 0; i < drinkData.length; i++) {
          var ingredeients = []
          for (let ingredeient in drinkData[i]) {
            if (ingredeient.match(/strIngredient/g)) {
              if (drinkData[i][ingredeient] != null)
                ingredeients.push(drinkData[i][ingredeient])
            }
          }
          drinkData[i].ingredeients = ingredeients
        }
      }
      this.infoData = data
    })
  }

  onSelect(event) {
    var searchData = this.searchBy.filter(ele => ele.name === event.target.value)[0]
    this.inputType = searchData.type
    if (this.inputType == 'radio') {
      this.radio1 = searchData.options[0]
      this.radio2 = searchData.options[1]
    }
  }

}

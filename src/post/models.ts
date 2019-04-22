export class Post {

    public id: number;
    public title: string;
    public content: string;
    public creation: Date;

    static fromObject(src) {
        return Object.assign(new Post(), src);
    }
 
    get firstLetter() {
      const name = this.title;
      return name ? name[0].toUpperCase() : '?';
    }

    get month() 
    {
      var creation: string = this.creation.toString();
      var arr = creation.split("-");
      var months = [ "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" ];
      var month_index =  parseInt(arr[1],10) - 1;
      return months[month_index];

     
    }
}

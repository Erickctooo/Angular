import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

interface MenuOption{
  icon: string;
  label: string;
  route: string;
  sublabel: string;
}

@Component({
  selector:'gifs-side-menu-options',
  templateUrl:'./side-menu-options.component.html',
  imports: [RouterLink,RouterLinkActive]
})


export default class SideMenuOptionsComponent{

  menuOptions:MenuOption[] =[
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      route: '/dashboard/trending',
      sublabel: 'Gifs Populares',
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Buscador',
      route: '/dashboard/search',
      sublabel: 'Buscar gifs',
    },
  ];

}

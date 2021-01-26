import config from '../config';
import EventEmitter from 'eventemitter3';

const EVENTS = {
  APP_READY: 'app_ready',
};

/**
 * App entry point.
 * All configurations are described in src/config.js
 */
export default class Application extends EventEmitter {
   constructor() {
    super();

    this.config = config;
    this.data = {
      count: 0,
      planets: []
    };
    
     this.init();
  }

  static get events() {
    return EVENTS;
  }

  /**
   * Initializes the app.
   * Called when the DOM has loaded. You can initiate your custom classes here
   * and manipulate the DOM tree. Task data should be assigned to Application.data.
   * The APP_READY event should be emitted at the end of this method.
   */
  async init() {
    // Initiate classes and wait for async operations here.
    const URL = 'https://swapi.dev/api/planets/';

    const response = await fetch(URL);
    const data = await response.json();

    this.data.count = data.count;
    this.data.planets = data.results;
    let nextPlanetPage = data.next;

    while (nextPlanetPage) {
      const response = await fetch(nextPlanetPage);
      const data = await response.json();
     
      nextPlanetPage = data.next;
      this.data.planets = [...this.data.planets, ...data.results];
    }

    console.log(this.data.planets, this.data.count)

    await this.emit(Application.events.APP_READY);
  }
}


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
    this.data = {};

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
    this.data.count = 0;
    this.data.planets = [];
    const URL = 'https://swapi.dev/api/planets/';

    const allDataFromApi = await fetch(URL)
      .then((res) => res.json());

    this.data.count = allDataFromApi.count;
    this.data.planets = allDataFromApi.results;
    let nextPlanetPage = allDataFromApi.next;

    while (nextPlanetPage) {
      const dataFromApi = await fetch(nextPlanetPage)
        .then((res) => res.json());

      nextPlanetPage = dataFromApi.next;
      this.data.planets = [...this.data.planets, ...dataFromApi.results];
    }

    this.emit(Application.events.APP_READY);
  }
}


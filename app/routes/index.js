import Route from '@ember/routing/route';
import { getOwner } from '@ember/application';

export default class IndexRoute extends Route {
  activate() {
    let lineGenerator = getOwner(this).lookup('controller:application').lineGenerator;
    lineGenerator.start();
  }
  resetController(controller, isExiting) {
    if (isExiting) {
      getOwner(this).lookup('controller:application').lineGenerator.stop();
    }
  }
}

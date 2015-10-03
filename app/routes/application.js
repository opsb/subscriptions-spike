import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.subscribe({
      planet: {
        criteria: {id: 'jupiter'},
        children: {
          moons: {
            criteria: {
              pageSize: 10,
              page: 1
            }
          }
        }
      }
    });
  },

  actions: {
    addTask(name) {
      this.store.addTask(name);
    }
  }
});

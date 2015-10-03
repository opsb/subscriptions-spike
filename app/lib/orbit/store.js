import Ember from 'ember';
import MemorySource from 'orbit-common/memory-source';
import Schema from 'orbit-common/schema';
import Orbit from 'orbit/main';
import Store from 'orbit-common/store';

Orbit.Promise = Ember.RSVP.Promise;

const {get} = Ember;


const schemaDefinition = {
  models: {
    project: {
      attributes: {
        name: {type: 'string'}
      },
      relationships: {
        tasks: {type: 'hasMany', model: 'tasks', inverse: 'project'}
      }
    },
    task: {
      attributes: {
        name: {type: 'string'}
      },
      relationships: {
        project: {type: 'hasOne', model: 'project', inverse: 'tasks'},
        comments: {type: 'hasMany', model: 'comment', inverse: 'task'}
      }
    },
    comment: {
      attributes: {
        name: {type: 'string'}
      },
      relationships: {
        task: {type: 'hasOne', model: 'task', inverse: 'comments'}
      }
    }
  }
};

const schema = new Schema(schemaDefinition);

const seedData = {
  project: {
    'project1': {
      id: 'project1',
      attributes: { name: 'Project One' },
      relationships: {
        tasks: {
          data: {
            task1: true
          }
        }
      }
    }
  },
  task: {
    'task1': {
      id: 'task1',
      attributes: { name: 'Task One' },
      relationships: {
        project: {
          data: 'project1'
        }
      }
    },
    'task2': {
      id: 'task2',
      attributes: { name: 'Task Two' },
      relationships: {
        project: {
          data: 'project1'
        }
      }
    }
  }
};

const Query = Ember.ArrayProxy.extend({
  run() {
    const results = this.get('store').runQuery(this.get('type'), this.get('filterFunction'));
    this.set('content', results);
  }
});

const NodeProxy = Ember.ObjectProxy.extend({

});

export default Ember.Object.extend({
  init() {
    this._store = new Store({schema});
    this._store.reset(seedData);
    this._nodeProxies = {};
    this._queries = [];
  },

  subscribe() {
    return this.buildNode('project', 'project1', {
      tasks: this.buildQuery('task', record => record.relationships.project.data === 'project1')
    });
  },

  buildQuery(type, filterFunction) {
    const query = Query.create({store: this, type: type, filterFunction: filterFunction});

    query.run();

    return query;
  },

  runQuery(type, callback) {
    const allRecords = this._store.retrieve(type);
    const allIds = Object.keys(allRecords);

    const results = [];

    allIds.forEach((id) => {
      const record = allRecords[id];

      if(callback(record)) {
        results.push(this.buildNode(type, id));
      }
    });

    return results;
  },

  trackQuery(query) {
    this._queries.pushObject(query);
  },

  buildNode(type, id, queries = {}) {
    const ref = this._store.retrieve([type, id]);
    const node = Ember.Object.create(Object.assign({}, ref.attributes, queries));
    const nodeProxy = NodeProxy.create({content: node});
    this.trackNodeProxy(type, id, nodeProxy);
    return nodeProxy;
  },

  trackNodeProxy(type, id, nodeProxy) {
    const path = [type, id].join('/');
    this._nodeProxies[path] = this._nodeProxies[path] || [];
    this._nodeProxies[path].pushObject(nodeProxy);
  },

  addTask(name) {
    get(this, '_data.project.projectOne.tasks').pushObject(Ember.Object.create({name: name}));
  }
});

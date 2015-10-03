import Ember from 'ember';
import MemorySource from 'orbit-common/memory-source';
import Schema from 'orbit-common/schema';
import Orbit from 'orbit/main';

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

const QueryProxy = Ember.ArrayProxy.extend({

});

export default Ember.Object.extend({
  init() {
    this._source = new MemorySource({schema});
    this._source.reset(seedData);
  },

  subscribe() {
    return this.buildNode('project', 'project1', {
      tasks: [
        this.buildNode('task', 'task1'),
        this.buildNode('task', 'task2')
      ]
    });
  },

  buildNode(type, id, queries = {}) {
    const ref = this._source.retrieve([type, id]);
    return Ember.Object.create(Object.assign({}, ref.attributes, queries));
  },

  addTask(name) {
    get(this, '_data.project.projectOne.tasks').pushObject(Ember.Object.create({name: name}));
  }
});

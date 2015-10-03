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
        planets: {type: 'hasMany', model: 'tasks', inverse: 'project'}
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

export default Ember.Object.extend({
  init() {
    this._source = new MemorySource({schema});
    this._data = {
      project: {
        projectOne: Ember.Object.create({
          name: "Project one",
          tasks: [
            Ember.Object.create({name: "Task one"}),
            Ember.Object.create({name: "Task two"}),
            Ember.Object.create({name: "Task three"})
          ]
        })
      }
    }
  },

  subscribe() {
    return this._data.project.projectOne;
  },

  addTask(name) {
    get(this, '_data.project.projectOne.tasks').pushObject(Ember.Object.create({name: name}));
  }
});

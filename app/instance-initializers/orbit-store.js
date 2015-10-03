import Store from 'subscriptions-spike/lib/orbit/store';

export default {
  name: 'orbit-store',

  initialize: function(application) {
    application.registry.register('store:main', Store);
    application.registry.injection('route', 'store', 'store:main');
  }
};

var DataviewModelBase = require('../../../src/dataviews/dataview-model-base');

describe('dataviews/dataview-model-base', function () {
  beforeEach(function () {
    this.model = new DataviewModelBase();
  });

  it('should listen to a dashboardBaseURL attribute change at the beginning', function () {
    spyOn(this.model, 'once').and.callThrough();
    this.model._initBinds(); // _initBinds is called when object is created, so
    // it is necessary to called again to have the spy
    // correctly set.
    expect(this.model.once.calls.argsFor(0)[0]).toEqual('change:url');
  });

  it('should add binds for url and bbox changes after first load', function () {
    spyOn(this.model, 'bind').and.callThrough();
    this.model.fetch = function (opts) {
      opts.success();
    };
    this.model.set('url', 'newurl');
    expect(this.model.bind.calls.argsFor(0)[0]).toEqual('change:url');
    expect(this.model.bind.calls.argsFor(1)[0]).toEqual('change:boundingBox');
  });

  describe('after first load', function () {
    beforeEach(function () {
      this.model.fetch = function (opts) {
        opts.success();
      };
      this.model.set('url', 'newurl');
    });

    it('should not fetch new data when url changes and sync is not enabled', function () {
      this.model.set('sync', false);
      spyOn(this.model, 'fetch');
      this.model.trigger('change:url', this.model);
      expect(this.model.fetch).not.toHaveBeenCalled();
    });

    it('should not fetch new data when url changes and dataview is disabled', function () {
      this.model.set('disabled', true);
      spyOn(this.model, 'fetch');
      this.model.trigger('change:url', this.model);
      expect(this.model.fetch).not.toHaveBeenCalled();
    });

    it('should not fetch new data when bbox changes and bbox is not enabled', function () {
      this.model.set('bbox', false);
      spyOn(this.model, 'fetch');
      this.model.trigger('change:boundingBox', this.model);
      expect(this.model.fetch).not.toHaveBeenCalled();
    });

    it('should not fetch new data when bbox changes and dataview is disabled', function () {
      this.model.set('disabled', true);
      spyOn(this.model, 'fetch');
      this.model.trigger('change:boundingBox', this.model);
      expect(this.model.fetch).not.toHaveBeenCalled();
    });
  });

  describe('when disabled', function () {
    it('should fetch again when disabled is disabled and url or boundingBox has changed', function () {
      spyOn(this.model, '_fetch');
      this.model.set('disabled', true);
      this.model.set('url', 'hello');
      this.model.set('disabled', false);
      expect(this.model._fetch).toHaveBeenCalled();
    });

    it('should not fetch when disabled is enabled', function () {
      spyOn(this.model, '_fetch');
      this.model.set('disabled', true);
      expect(this.model._fetch).not.toHaveBeenCalled();
    });
  });

  it('should trigger loading event when fetch is launched', function () {
    spyOn(this.model, 'trigger');
    this.model.fetch();
    expect(this.model.trigger).toHaveBeenCalledWith('loading', this.model);
  });
});
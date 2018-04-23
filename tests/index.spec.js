import {mount, createLocalVue} from '@vue/test-utils';
import sinon from 'sinon';
import Timer from '../src';
import TimerStub from './timer-stub';

describe('vue-plugin-timer', () => {
  before(function() {
    this.clock = sinon.useFakeTimers();
  });

  after(function() {
    this.clock.restore();
  });

  it('$timeout auto clear', function() {
    const localVue = createLocalVue();
    localVue.use(Timer);

    const fn = sinon.spy();
    TimerStub.mounted = function() {
      this.$timeout(fn, 0);
      this.$timeout(fn, 1);
    };

    const wrapper = mount(TimerStub, {
      localVue
    });
    this.clock.next();
    fn.should.be.calledOnce();
    wrapper.destroy();
    this.clock.next();
    fn.should.be.calledOnce();
    delete TimerStub.mounted;
  });

  it('$timeout manual clear', function() {
    const localVue = createLocalVue();
    localVue.use(Timer);

    const fn = sinon.spy();
    let timerId;
    TimerStub.mounted = function() {
      timerId = this.$timeout(fn, 1);
    };

    const wrapper = mount(TimerStub, {
      localVue
    });
    wrapper.vm.$clear(timerId);
    this.clock.next();
    fn.should.be.not.called();
    delete TimerStub.mounted;
  });

  it('$interval auto clear', function() {
    const localVue = createLocalVue();
    localVue.use(Timer);

    const fn = sinon.spy();
    TimerStub.mounted = function() {
      this.$interval(fn, 1);
    };

    const wrapper = mount(TimerStub, {
      localVue
    });
    this.clock.next();
    fn.should.be.calledOnce();
    wrapper.destroy();
    this.clock.next();
    fn.should.be.calledOnce();
    delete TimerStub.mounted;
  });

  it('$interval manual clear', function() {
    const localVue = createLocalVue();
    localVue.use(Timer);

    const fn = sinon.spy();
    let timerId;
    TimerStub.mounted = function() {
      timerId = this.$interval(fn, 1);
    };

    const wrapper = mount(TimerStub, {
      localVue
    });
    this.clock.next();
    fn.should.be.calledOnce();
    wrapper.vm.$clear(timerId);
    this.clock.next();
    fn.should.be.calledOnce();
    delete TimerStub.mounted;
  });
});

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

  it('$setTimeout auto clear', function() {
    const localVue = createLocalVue();
    localVue.use(Timer);

    const fn = sinon.spy();
    TimerStub.mounted = function() {
      this.$setTimeout(fn, 0);
      this.$setTimeout(fn, 1);
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

  it('$setTimeout manual clear', function() {
    const localVue = createLocalVue();
    localVue.use(Timer);

    const fn = sinon.spy();
    let timerId;
    TimerStub.mounted = function() {
      timerId = this.$setTimeout(fn, 1);
    };

    const wrapper = mount(TimerStub, {
      localVue
    });
    wrapper.vm.$clearTimeout(timerId);
    this.clock.next();
    fn.should.be.not.called();
    delete TimerStub.mounted;
  });

  it('$setInterval auto clear', function() {
    const localVue = createLocalVue();
    localVue.use(Timer);

    const fn = sinon.spy();
    TimerStub.mounted = function() {
      this.$setInterval(fn, 1);
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

  it('$setInterval manual clear', function() {
    const localVue = createLocalVue();
    localVue.use(Timer);

    const fn = sinon.spy();
    let timerId;
    TimerStub.mounted = function() {
      timerId = this.$setInterval(fn, 1);
    };

    const wrapper = mount(TimerStub, {
      localVue
    });
    this.clock.next();
    fn.should.be.calledOnce();
    wrapper.vm.$clearInterval(timerId);
    this.clock.next();
    fn.should.be.calledOnce();
    delete TimerStub.mounted;
  });
});

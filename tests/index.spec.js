import { should } from "chai";
import { mount, createLocalVue } from "@vue/test-utils";
import Timer from "../src"
import TimerTester from "./timer-tester";

describe("install success", () => {
  it("renders props.msg when passed", () => {
    const localValue = createLocalVue();
    localValue.use(Timer);

    const wrapper = mount(TimerTester, {
      localValue
    });
    // should(wrapper.vm.$timeout).be();
  });
});

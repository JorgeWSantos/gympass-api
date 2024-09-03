import type { Environment } from "vitest";

export default <Environment>{
  name: "custom",
  transformMode: "ssr",
  // optional - only if you support "experimental-vm" pool
  // async setupVM() {
  //   const vm = await import("node:vm");
  //   const context = vm.createContext();
  //   return {
  //     getVmContext() {
  //       return context;
  //     },
  //     teardown() {
  //       console.log("teardown2");

  //       // called after all tests with this env have been run
  //     },
  //   };
  // },
  async setup() {
    console.log("test");
    // custom setup
    return {
      async teardown() {
        // called after all tests with this env have been run
        console.log("teardown");
      },
    };
  },
};

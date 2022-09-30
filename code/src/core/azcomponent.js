import { defineComponent } from 'vue';
export default function AZComponent(component) {
    console.log("AZComponent", component);
    component.inject = component.inject || [];
    component.inject.push("bind");
    return defineComponent(component)
}
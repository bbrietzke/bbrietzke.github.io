# Introductions
This is to document how to handle installs and upgrade inside a Kubernetes cluster using tools such as `kustomize` and `helm`.

## Components
A component is an install application inside Kubernetes.  It may have dependencies on other components, or other components may depend on it.  

A component may have multiple sub-components available to it.  These sub-components may be optional, or represent alternate configurations available to the component.

Each component is installed via `helm` or `kustomize`, not both.  Each install should represent a semi-permanent state that the component should exist in.


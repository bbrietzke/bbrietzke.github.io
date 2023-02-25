# Installing Kubernetes

These are my notes on installing [Kubernetes](https://kubernetes.io/).  They work for me in my home network.  They might might work for you.


## Setup
Almost all of the heavy lifting is done through [Ansible](https://www.ansible.com/).  That gets the software on the server, but doesn't do much in the way of 
configuration, which is why I'm writting this up. You can find the playbooks and documents [over here](https://bbrietzke.github.io/ansible/). 

I had most of this infrastructure running on Raspberry Pi's in the most recent past, so the roles take care of handling all the hardwork of making sure things
will work on RPIv4 machines.

The current config has three machines, Basil, Lavender and Catnip ( yes, herbs because why not ).  Basil is the control-plane, while the other two are
workers.  Basil and Lavender are [cheap machines](https://www.amazon.com/dp/B0B2D8BZKP?psc=1&ref=ppx_yo2ov_dt_b_product_details) while Catnip is an old 
Macbook Pro I had collecting dust.  Regardless of the hardware, this should work for most machines.

## Step One
Make sure the machines are updated, working and communicating with _ansible_, otherwise not much of this is going to work.  Most often you will need to change
the inventory configuration to make which ever IPs the servers are on.

After that is done, go ahead and execute the __kubex__ playbook and grab a refreshing drink.  It will take about twenty minutes, give or take.

## Step Two
Next we need to get the control-plane setup.  This isn't to hard and I put most of the configuration that I use inside a configuration file that the ansible scripts 
will build on Basil.

Execute ( on __Basil__ ):
```
sudo kubeadm init --config /opt/kubeadm-config.yml
```

This will get _kubeadm_ up and running and installing all the software.  If you want to, look at the configuration file to see exactly what it is doing.  

I put everything in a configuration file since I was tired of dealing with command line options.  And configuration as code, because that's just smart.

Once _kubeadm_ is complete, make sure the setup the kubectl configuration file and copy the command that that allows other nodes to join.

## Step Three
I prefer to setup networking before I worry about the worker nodes, but that's just me.  You can do steps three and four at the same time if you can multitask.

The only networking controller that i have been able to get working reliably is [Project Calico](https://www.tigera.io/project-calico/). This [docs](https://projectcalico.docs.tigera.io/getting-started/kubernetes/quickstart) are functional,
but not great.  

Bottom line is it works every time I have setup Kubernetes unlike some of the others.

Execute ( on __Basil__ ):
```
kubectl create -f https://projectcalico.docs.tigera.io/manifests/tigera-operator.yaml  && kubectl create -f /opt/calico-custom-resources.yml
```

It will take a few minutes, but should be any problems installing.

## Step Four
Remember that command you saved from Step Two? Yes? Good!

Log into each of your worker nodes and execute it.  That will connect the workers to the control-plane and get the entire show running.

## Step Five
It will take the networking a while to settle in, or at least it always has for me.  

Execute ( on __Basil__ ):
```
kubectl get nodes -o wide
```

You can also create a very basic _nginx_ deployment just to see if things work.
```
kubectl apply -f https://gist.githubusercontent.com/bbrietzke/c59b6132c37ea36f9b84f1fee701a642/raw/00e1683fbd7422fc297629128b08bded6ca3c90b/kubernetes-test.yaml
```

Then:
```
open http://basil.local:30080/
```

And you should see a website in the browser of your choice.
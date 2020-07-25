FROM jenkins/jenkins:lts-alpine
LABEL maintainer="Harvash <harvash2004@yahoo.com>"

ENV JENKINS_USER admin
ENV JENKINS_PASS admin

# Skip initial setup
ENV JAVA_OPTS -Djenkins.install.runSetupWizard=false

COPY jenkins_plugin_list.txt /usr/share/jenkins/plugins.txt
RUN /usr/local/bin/install-plugins.sh < /usr/share/jenkins/plugins.txt

# Scaling
RUN /usr/local/bin/install-plugins.sh kubernetes

USER root

RUN apk update && apk add gcc libc-dev make git libffi-dev openssl-dev python3-dev libxml2-dev libxslt-dev 

ENV PYTHONUNBUFFERED=1

RUN echo "**** install Python ****" && \
    apk add --no-cache python3 && \
    if [ ! -e /usr/bin/python ]; then ln -sf python3 /usr/bin/python ; fi && \
    \
    echo "**** install pip ****" && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --no-cache --upgrade pip setuptools wheel && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi

RUN pip install docker-compose && \
    pip install openshift && \
    pip install ansible && \
    pip install azure-cli && \
    pip install packaging && \
    pip install cx-Oracle && \
    pip install jmespath && \
    pip install kubernetes && \
    pip install msrestazure

USER jenkins
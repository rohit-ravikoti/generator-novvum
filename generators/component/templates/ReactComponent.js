import React from 'react';

class <%= componentName %> extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <%= componentName %>
      </div>
    );
  }
}

<%= componentName %>.propTypes = {
};

<%= componentName %>.defaultProps = {
};

export default <%= componentName %>;

import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Error:', error);
    console.log('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button type="button" onClick={() => this.setState({ hasError: false })}>
            エラーが発生しましたので、アクセスしなおしてください。
            何かございましたら問い合わせフォームにてご連絡ください。
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

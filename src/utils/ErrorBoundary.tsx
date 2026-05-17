import { Component } from 'react';
import CustomLink from './CustomLink';
import Logo from '../assets/logo.jpg';

interface ErrorProps {
  channel: string;
}

const ErrorView = ({ channel }: ErrorProps) => {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <title>{`Error - ${channel}`}</title>
      <img src={Logo} alt="" style={{ height: 'auto', maxWidth: '200px' }} />
      <div className="flex justify-center mt-4">
        <h5 className="text-red-400 text-xl font-semibold">Something went wrong</h5>
      </div>
      <div className="flex justify-center mt-4">
        <CustomLink
          href="/"
          className="border border-primary text-primary px-4 py-2 rounded hover:bg-primary/10 transition-colors inline-block"
        >
          Go Home
        </CustomLink>
      </div>
    </div>
  );
};

export default class ErrorBoundary extends Component<
  { channel: string; children?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { channel: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorView channel={this.props.channel} />;
    }
    return this.props.children;
  }
}

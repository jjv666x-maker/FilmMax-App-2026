import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: ''
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'حدث خطأ غير متوقع في واجهة العرض'
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[FilmMax Security Boundary] Caught error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0c0f15] flex items-center justify-center p-4 text-center">
          <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-white/10 space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-[#e50914] flex items-center justify-center mx-auto border border-red-500/30 shadow-lg">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">حارس الأمان السينمائي</h2>
              <p className="text-xs text-gray-400 leading-relaxed">
                تم احتواء الخطأ البرمجي بأمان لمنع توقف التطبيق أو تسريب البيانات.
              </p>
            </div>

            <div className="p-3.5 bg-black/40 rounded-2xl border border-white/5 text-[11px] font-mono text-red-400 text-left dir-ltr truncate">
              {this.state.errorMessage}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>العودة للرئيسية</span>
              </button>

              <button
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 rounded-xl bg-[#e50914] hover:bg-[#ff1f2d] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#e50914]/30 transition-all active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                <span>تحديث الصفحة</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

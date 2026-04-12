import React, { createContext, useContext, useState, useMemo } from 'react';
import TransactionModal, { TransactionCategory } from '../components/TransactionModal';
import SystemModal, { SystemModalType } from '../components/SystemModal';

interface UIContextValue {
    showTransactionModal: (params: {
        status: 'success' | 'error';
        category: TransactionCategory;
        txId?: string;
        message?: string;
        actionLink?: string;
    }) => void;
    showSystemModal: (params: {
        type: SystemModalType;
        title: string;
        message: string;
        actionLink?: string;
        actionLabel?: string;
    }) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export const useUI = () => {
    const context = useContext(UIContext);
    if (!context) throw new Error('useUI must be used within a UIProvider');
    return context;
};

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        status: 'success' | 'error';
        category: TransactionCategory;
        txId?: string;
        message?: string;
        actionLink?: string;
    }>({
        isOpen: false,
        status: 'success',
        category: 'GENERIC'
    });

    const [systemModalConfig, setSystemModalConfig] = useState<{
        isOpen: boolean;
        type: SystemModalType;
        title: string;
        message: string;
        actionLink?: string;
        actionLabel?: string;
    }>({
        isOpen: false,
        type: 'info',
        title: '',
        message: ''
    });

    const showTransactionModal = (params: any) => setModalConfig({ ...params, isOpen: true });
    const showSystemModal = (params: any) => setSystemModalConfig({ ...params, isOpen: true });

    const value = useMemo(() => ({
        showTransactionModal,
        showSystemModal
    }), []);

    return (
        <UIContext.Provider value={value}>
            {children}
            <TransactionModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
                status={modalConfig.status}
                category={modalConfig.category}
                txId={modalConfig.txId}
                message={modalConfig.message}
                cluster="devnet"
            />
            <SystemModal
                isOpen={systemModalConfig.isOpen}
                onClose={() => setSystemModalConfig(prev => ({ ...prev, isOpen: false }))}
                type={systemModalConfig.type}
                title={systemModalConfig.title}
                message={systemModalConfig.message}
                actionLink={systemModalConfig.actionLink}
                actionLabel={systemModalConfig.actionLabel}
            />
        </UIContext.Provider>
    );
};

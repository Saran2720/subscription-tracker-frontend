import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubscription, cancelSubscription, deleteSubscription } from '../services/api';

const statusColor = {
    active: 'bg-green-500/10 text-green-400 border border-green-500/30',
    cancelled: 'bg-red-500/10 text-red-400 border border-red-500/30',
    expired: 'bg-gray-500/10 text-gray-400 border border-gray-500/30',
};

const SubscriptionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [cancelLoading, setCancelLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const res = await getSubscription(id);
                setSubscription(res.data.data);
            } catch (err) {
              console.error(err.response || err);
                setError('Failed to load subscription');
            } finally {
                setLoading(false);
            }
        };
        fetchSubscription();
    }, [id]);

    const handleCancel = async () => {
        setCancelLoading(true);
        try {
            const res = await cancelSubscription(id);
            setSubscription(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to cancel subscription');
        } finally {
            setCancelLoading(false);
        }
    };

    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await deleteSubscription(id);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete subscription');
            setDeleteLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
            Loading...
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center text-red-400">
            {error}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Navbar */}
            <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-400">SubTracker</h1>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="text-sm text-gray-400 hover:text-white transition"
                >
                    ← Back to Dashboard
                </button>
            </nav>

            <div className="max-w-lg mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">{subscription.name}</h2>
                        <p className="text-gray-400 capitalize">{subscription.category} · {subscription.frequency}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusColor[subscription.status]}`}>
                        {subscription.status}
                    </span>
                </div>

                {/* Details Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4 mb-6">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Price</span>
                        <span className="font-semibold">{subscription.currency} {subscription.price}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Frequency</span>
                        <span className="font-semibold capitalize">{subscription.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Payment Method</span>
                        <span className="font-semibold">{subscription.payementMethod}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Start Date</span>
                        <span className="font-semibold">{new Date(subscription.startDate).toDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Renewal Date</span>
                        <span className="font-semibold text-blue-400">{new Date(subscription.renewalDate).toDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Created</span>
                        <span className="font-semibold">{new Date(subscription.createdAt).toDateString()}</span>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                    {subscription.status === 'active' && (
                        <button
                            onClick={handleCancel}
                            disabled={cancelLoading}
                            className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 border border-yellow-600/40 text-yellow-400 font-semibold py-3 rounded-lg transition disabled:opacity-50"
                        >
                            {cancelLoading ? 'Cancelling...' : 'Cancel Subscription'}
                        </button>
                    )}

                    {/* Delete with confirmation */}
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 text-red-400 font-semibold py-3 rounded-lg transition"
                        >
                            Delete Subscription
                        </button>
                    ) : (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                            <p className="text-red-400 text-sm mb-3 text-center">
                                Are you sure? This cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition text-sm disabled:opacity-50"
                                >
                                    {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionDetail;
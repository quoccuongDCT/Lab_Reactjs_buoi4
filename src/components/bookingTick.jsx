import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setName, selectSeat, deselectSeat, clearSelected, confirmBookingAsync } from '../features/bookingSlice';

export default function MovieSeatBooking() {
    const rows = useSelector(s => s.seats.rows);
    const name = useSelector(s => s.booking.name);
    const selected = useSelector(s => s.booking.selected);
    const bookings = useSelector(s => s.booking.bookings);
    const status = useSelector(s => s.booking.status);
    const dispatch = useDispatch();

    const toggleSeat = (g) => {
        if (!name.trim()) return alert('Nhập tên trước khi chọn ghế nhé.');
        if (g.daDat) return;
        const exists = selected.find(s => s.soGhe === g.soGhe);
        if (exists) dispatch(deselectSeat(g.soGhe));
        else dispatch(selectSeat({ soGhe: g.soGhe, gia: g.gia }));
    };

    const total = useMemo(() => selected.reduce((s, x) => s + (x.gia || 0), 0), [selected]);

    const onConfirm = () => {
        if (!name.trim()) return alert('Nhập tên đã');
        if (selected.length === 0) return alert('Chọn ít nhất 1 ghế');
        const seatsList = selected.map(s => s.soGhe);
        dispatch(confirmBookingAsync({ name, seats: seatsList, total }));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Đặt vé xem phim - Redux demo</h1>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Seats area */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="text-sm text-gray-600">Nhập tên (bắt buộc trước khi chọn ghế)</div>
                            <input value={name} onChange={e => dispatch(setName(e.target.value))} placeholder="Tên khách..." className="w-full mt-2 py-2 px-3 border rounded-lg" />
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-600">Ghế đang chọn</div>
                            <div className="mt-2 font-mono">{selected.map(s => s.soGhe).join(', ') || '—'}</div>
                        </div>
                    </div>

                    <div className="mb-4 text-center">
                        <div className="mx-auto w-3/4 bg-gradient-to-r from-gray-300 to-gray-200 rounded-md py-2 px-4">
                            <span className="text-gray-700">MÀN HÌNH</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <div className="flex flex-col gap-3">
                            {rows.map((row, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-8 text-right font-mono text-sm text-gray-600">{row.hang}</div>
                                    <div className="grid grid-cols-12 gap-2 flex-1">
                                        {row.danhSachGhe.map((g, i) => {
                                            const isSelected = selected.some(s => s.soGhe === g.soGhe);
                                            const baseClass = "py-2 px-2 rounded-md text-sm border font-medium select-none";
                                            const bookedClass = "bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed";
                                            const availClass = "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 cursor-pointer";
                                            const selClass = "bg-yellow-300 text-yellow-900 border-yellow-400 cursor-pointer";
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => toggleSeat(g)}
                                                    className={`${baseClass} ${g.daDat ? bookedClass : (isSelected ? selClass : availClass)}`}
                                                    title={g.daDat ? 'Đã đặt' : `${g.soGhe} — ${g.gia ? g.gia.toLocaleString() + ' VND' : 'Miễn phí'}`}>
                                                    {g.soGhe}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex gap-4 items-center">
                        <span className="flex items-center gap-2"><span className="w-6 h-6 rounded-sm bg-green-50 border border-green-200"></span> Có thể chọn</span>
                        <span className="flex items-center gap-2"><span className="w-6 h-6 rounded-sm bg-yellow-300 border border-yellow-400"></span> Đang chọn</span>
                        <span className="flex items-center gap-2"><span className="w-6 h-6 rounded-sm bg-gray-300 border border-gray-300"></span> Đã đặt</span>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col">
                    <h2 className="text-lg font-semibold mb-3">Thông tin đặt vé</h2>
                    <div className="mb-4">
                        <div className="text-sm text-gray-600">Ghế đã chọn ({selected.length})</div>
                        <div className="mt-2 flex flex-col gap-2 max-h-32 overflow-auto">
                            {selected.length === 0 && <div className="text-gray-400">Chưa chọn ghế nào</div>}
                            {selected.map(s => (
                                <div key={s.soGhe} className="flex justify-between items-center">
                                    <div className="font-mono">{s.soGhe}</div>
                                    <div className="text-sm">{(s.gia || 0).toLocaleString()} VND</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-3">
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-sm text-gray-600">Tổng</div>
                            <div className="text-xl font-semibold">{total.toLocaleString()} VND</div>
                        </div>
                        <button onClick={onConfirm} className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700" disabled={status === 'loading'}>
                            {status === 'loading' ? 'Đang xử lý...' : 'Xác nhận đặt vé'}
                        </button>
                        <button onClick={() => dispatch(clearSelected())} className="w-full mt-2 py-2 rounded-lg border border-gray-200 text-gray-700">Hủy chọn</button>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">Ghi chú: Đây là demo Redux. Trong thực tế cần xử lý conflict với server.</div>

                    <div className="mt-6">
                        <h3 className="text-sm font-semibold mb-2">Danh sách người đã đặt</h3>
                        <div className="overflow-auto max-h-40">
                            <table className="w-full text-sm table-auto">
                                <thead>
                                    <tr className="text-left text-gray-600">
                                        <th className="p-1">#</th>
                                        <th className="p-1">Tên</th>
                                        <th className="p-1">Ghế</th>
                                        <th className="p-1">Số lượng</th>
                                        <th className="p-1">Tổng</th>
                                        <th className="p-1">Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.length === 0 && (<tr><td colSpan={6} className="p-2 text-gray-400">Chưa có booking</td></tr>)}
                                    {bookings.map((b, idx) => (
                                        <tr key={b.id} className="border-t">
                                            <td className="p-1 align-top">{idx + 1}</td>
                                            <td className="p-1 align-top font-medium">{b.name}</td>
                                            <td className="p-1 align-top font-mono">{b.seats.join(', ')}</td>
                                            <td className="p-1 align-top">{b.count}</td>
                                            <td className="p-1 align-top">{b.total?.toLocaleString ? b.total.toLocaleString() : b.total} VND</td>
                                            <td className="p-1 align-top text-xs text-gray-500">{b.time}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            <div className="mt-6 text-sm text-gray-600 max-w-3xl text-center">Mẹo: kiểm tra console/network khi tích hợp API thật.</div>
        </div>
    );
}
import React, { useState, useEffect, useRef } from 'react'

const TopNav = ({ onLogout }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState(null)
  const notificationsRef = useRef(null)
  
  // Modaldan tashqari joy bosilganda modalni yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Xabarni ochish
  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification)
  }

  // Xabar modalni yopish
  const closeNotificationModal = () => {
    setSelectedNotification(null)
  }

  // Namunaviy xabarlar
  const notifications = [
    {
      id: 1,
      title: "Yangi xodim qo'shildi",
      message: "John Doe kompaniyaga yangi xodim sifatida qo'shildi",
      time: "10 daqiqa oldin",
      isRead: false
    },
    {
      id: 2,
      title: "Majlis eslatmasi",
      message: "Bugun soat 15:00 da umumiy majlis bo'ladi",
      time: "1 soat oldin",
      isRead: false
    },
    {
      id: 3,
      title: "Tizim yangilandi",
      message: "Tizimning yangi versiyasi o'rnatildi",
      time: "2 soat oldin",
      isRead: true
    }
  ]

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end h-16">
          <div className="flex items-center gap-8">
            

            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 relative"
              >
                <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
                {notifications.filter(n => !n.isRead).length > 0 && (
              <span className="text-sm font-medium text-gray-700">{notifications.filter(n => !n.isRead).length} ta yangi habar</span>
                                    )}
            </div>
              </button>

              {/* Xabarlar modali */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Xabarlar</h3>
                      <span className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                        Barchasini o'qilgan deb belgilash
                      </span>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
                      Barcha xabarlarni ko'rish
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-orange-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-orange-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">Botir Akhmedov</span>
                <span className="text-xs text-gray-500">Administrator</span>
              </div>
            </div>

            

            {/* Xabar detallari modali */}
            {selectedNotification && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closeNotificationModal}></div>
                  </div>

                  <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                              {selectedNotification.title}
                            </h3>
                            <span className="text-sm text-gray-500">
                              {selectedNotification.time}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              {selectedNotification.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        onClick={closeNotificationModal}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Yopish
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span className="font-medium">Chiqish</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNav

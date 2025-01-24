const ActivityList = () => {
  return (
    <div className="mt-8 bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">So'nggi faoliyat</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="ml-4">
              <p className="font-medium">Foydalanuvchi #1</p>
              <p className="text-sm text-gray-500">Buyurtma berdi</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">5 daqiqa oldin</span>
        </div>
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="ml-4">
              <p className="font-medium">Foydalanuvchi #2</p>
              <p className="text-sm text-gray-500">Ro'yxatdan o'tdi</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">15 daqiqa oldin</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="ml-4">
              <p className="font-medium">Foydalanuvchi #3</p>
              <p className="text-sm text-gray-500">Sharh qoldirdi</p>
            </div>
          </div>
          <span className="text-sm text-gray-500">1 soat oldin</span>
        </div>
      </div>
    </div>
  )
}

export default ActivityList

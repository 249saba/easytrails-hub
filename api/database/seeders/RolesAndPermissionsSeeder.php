<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('permission_groups')->insert([
            [
                'name' => 'User Management',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ]);

        DB::table('roles')->insert([
            [
                'name' => 'ET Admin',
                'label' => 'et-admin',
                'guard_name' => 'api',
                'active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'name' => 'ET PM',
                'label' => 'et-pm',
                'guard_name' => 'api',
                'active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ]);

        DB::table('permissions')->insert([
            [
                'permission_group_id' => 1,
                'name' => 'Invite User',
                'label' => 'invite-user',
                'guard_name' => 'api',
                'order_number' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'permission_group_id' => 1,
                'name' => 'Update User',
                'label' => 'update-user',
                'guard_name' => 'api',
                'order_number' => 2,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'permission_group_id' => 1,
                'name' => 'deactivate-user',
                'label' => 'Deactivate User',
                'guard_name' => 'api',
                'order_number' => 3,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ]);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $role = Role::whereLabel('et-admin')->first();

        $permissions = Permission::pluck('id','id')->all();

        $role->syncPermissions($permissions);
    }
}
